const resize = {
  bind(el, binding) {
    let width = '', height = '';
    function isResize() {
      const style = document.defaultView.getComputedStyle(el)
      if (width !== style.width || height !== style.height) {
        binding.value({ width: style.width, height: style.height })
      }

      width = style.width
      height = style.height
    }

    el.__vueSetInterval__ = setInterval(isResize, 300)
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval__);
  }
}

export default resize;