$(function() {

  const $code = $('pre code')
  $code.each(function() {
    let $this = $(this);
    $this.attr('contenteditable',true);
  });

  //do final 
  const $iframes = $('body div[runCode]');
  
  
  function html_decode(str) 
  { 
      var s = ""; 
      if (str.length == 0) return ""; 
      s = str.replace(/&amp;/g, "&"); 
      s = s.replace(/&lt;/g, "<"); 
      s = s.replace(/&gt;/g, ">"); 
      s = s.replace(/&nbsp;/g, " "); 
      s = s.replace(/&#39;/g, "\'"); 
      s = s.replace(/&quot;/g, "\""); 
      s = s.replace(/<br\/>/g, "\n"); 
      return s; 
  } 

 
  const render = ()=> {
    
    $iframes.each(function() {
      const $this = $(this);
      const $div = $('div[x-iframe-id]');
      // console.log($div[0]);
      const $html = $div.find('pre code[data-lang=html]');
      // console.log('html is ',$html[0]);
      const $css = $div.find('pre code[data-lang=css]');
      const $js = $div.find('pre code[data-lang=js]');
      const code = `${$html.text()||''}
         <style>${$css.text()||''}</style>
        <script>
          ${$js.text()||''}
        </script>
      `
      let temp = $this[0];
      temp.innerHTML =  '<iframe id="preview-iframe" sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts" name="iframe" frameborder="0"></iframe>';
      let a = $this.find('iframe')
      let ifele = a[0];
      let iframe = ifele.contentDocument|| ifele.contentWindow.document;
      iframe.open();
      iframe.write(code);
      iframe.close();    

    })
  }
  // 防抖
  function debounce (fn, delay) {
    let timer ;

    return function(){
        const context = this
        if (timer) {
            clearTimeout(timer)
        } 
        timer = setTimeout(function() {
            fn.apply(context,arguments)
        }, delay)
    }
  }
  const renderX =  debounce(render,6000);
  // render();
  // render();
  
  // const $write = $('body #content');
  //监听 元素变化
  // $write.on('DOMSubtreeModified',function(e) {
  //   console.log('change -- node --');
  // })
  // render();
  // 监听元素变化
  const $write = document.querySelectorAll('pre');
  const observer = new MutationObserver((mutations, observer) => {
    // console.log(mutations, observer);
    renderX();
  });
  // renderX();
  render();
  // console.log('--',$write);
  for(let a of $write) {
    observer.observe(a, {
      subtree:true,
      childList:true,
      // attributes: true
    });
  }

});