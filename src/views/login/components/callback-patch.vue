<template>
  <Form
    ref="target"
    :validation-schema="mySchema"
    v-slot="{errors}"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          :class="{err:errors.account}"
          name="account"
          v-model="form.account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div v-if="errors.account" class="error">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{err:errors.mobile}"
          name="mobile"
          v-model="form.mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{err:errors.code}"
          name="code"
          v-model="form.code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="send">{{time===0 ? '发送验证码' : `${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{err:errors.password}"
          name="password"
          v-model="form.password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{err:errors.rePassword}"
          name="rePassword"
          v-model="form.rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 1.表单校验 多两种校验规则：用户名是否存在，两次输入密码是否一致
    // 2.发送短信验证码：接口API定义
    // 3.完善信息

    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })

    // 表单校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // -------------------------------
    // 定时器
    const target = ref(null)
    let time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    // 发送短信验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          await userQQPatchCode({ mobile: form.mobile })
          Message({ type: 'success', text: '发送成功!' })
          time.value = 60
          resume()
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }

    // ------------------------------------------------------
    // 立即提交
    // 完善信息
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await target.value.validate()
      if (valid) {
        try {
          const { result } = await userQQPatchLogin({ unionId: props.unionId, data: form })
          // 1.存储用户信息
          const { id, account, avatar, mobile, nickname, token } = result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2.跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3.成功提示
          Message({ type: 'success', text: 'QQ完善信息成功' })
        } catch (err) {
          Message({ type: 'error', text: '完善信息失败!' })
        }
      }
    }
    return { form, mySchema, send, target, time, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
