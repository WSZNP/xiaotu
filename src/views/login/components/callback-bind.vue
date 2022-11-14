<template>
  <Form
    ref="target"
    :validation-schema="mySchema"
    v-slot="{errors}"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="user-info">
      <img :src="avatar" alt />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
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
          placeholder="绑定的手机号"
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
          placeholder="短信验证码"
        />
        <span class="code" @click="send">{{time===0 ? '发送验证码' : `${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import QC from 'qc'
import { onUnmounted, reactive, ref } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 1.准备下信息：unionId(openId) QQ头像 昵称
    // 2.完成表单校验
    // 3.发送验证码(校验，定义API，调用，倒计时)
    // 4.进行绑定（绑定成功就是登陆成功）
    const nickname = ref(null)
    const avatar = ref(null)

    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1
      })
    }

    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

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
          await userQQBindCode({ mobile: form.mobile })
          Message({ type: 'success', text: '发送成功!' })
          time.value = 60
          resume()
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }

    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await target.value.validate()
      if (valid) {
        try {
          const { result } = await userQQBindLogin({ unionId: props.unionId, ...form })
          // 1.存储用户信息
          const { id, account, avatar, mobile, nickname, token } = result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2.跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3.成功提示
          Message({ type: 'success', text: 'QQ绑定成功' })
        } catch (err) {
          Message({ type: 'error', text: '绑定失败!' })
        }
      }
    }
    return { nickname, avatar, form, mySchema, send, target, time, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
