import { ref } from 'vue'
/**
 * fn 需要增加竞态锁的函数
 * @param fn
 * @param autoUnlock autoUnlock === true 不管fn返回什么, 都自动解锁
 *                   autoUnlock === false 不管fn返回什么, 都不自动解锁
 *                   autoUnlock === 'auto' (默认值) 当fn返回false时, 不自动解锁, 返回其他值时, 自动解锁
 * @returns Fn 函数对象
 * 例子:
 *  const handleLogin = useLockFn(async form => {
 *  const { code, message } = await api.post('/user/login', form)
 *     if (code === 200) {
 *        // 其他逻辑
 *        // return false
 *     }
 *  })
 */
const useLockFn = (fn : any = () => {}, autoUnlock : any= 'auto') => {
  const lock = ref(false)
  return async (...args) => {
    if (lock.value) return
    lock.value = true
    try {
      const $return = await fn(...args)
      if (autoUnlock === true || (autoUnlock === 'auto' && $return !== false)) lock.value = false
    } catch (e) {
      lock.value = false
      throw e
    }
  }
}

export default useLockFn
