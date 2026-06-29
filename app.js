(function(){
  var I=window.I18N||{};
  var T=document.getElementById('wc-input');
  if(!T) return;
  var CJK=/[㐀-䶿一-鿿豈-﫿぀-ゟ゠-ヿㇰ-ㇿ가-힣ｦ-ﾟ]/g;
  function cp(s){return Array.from(s).length;}
  function bytes(s){try{return new TextEncoder().encode(s).length;}catch(e){return unescape(encodeURIComponent(s)).length;}}
  function set(id,v){var el=document.getElementById(id);if(el)el.textContent=v;}
  function update(){
    var s=T.value;
    var chars=cp(s);
    var nospace=cp(s.replace(/\s/g,''));
    var cjk=(s.match(CJK)||[]).length;
    var west=(s.replace(CJK,' ').match(/[^\s]+/g)||[]).length;
    var words=cjk+west;
    var lines=s.length?s.split(/\r\n|\r|\n/).length:0;
    var paras=s.trim()?s.trim().split(/\n\s*\n+/).length:0;
    var read=words?Math.max(1,Math.round(words/200)):0;
    set('c-chars',chars.toLocaleString());
    set('c-nospace',nospace.toLocaleString());
    set('c-cjk',cjk.toLocaleString());
    set('c-words',words.toLocaleString());
    set('c-lines',lines.toLocaleString());
    set('c-paras',paras.toLocaleString());
    set('c-bytes',bytes(s).toLocaleString());
    set('c-read',read+' '+(I.readUnit||'min'));
  }
  function titleCase(s){return s.toLowerCase().replace(/([^\W\d_]+)/g,function(w){return w.charAt(0).toUpperCase()+w.slice(1);});}
  function sentenceCase(s){return s.toLowerCase().replace(/(^\s*\w|[.!?。！？]\s*\w)/g,function(m){return m.toUpperCase();});}
  var OPS={
    upper:function(s){return s.toUpperCase();},
    lower:function(s){return s.toLowerCase();},
    title:titleCase,
    sentence:sentenceCase,
    trim:function(s){return s.split(/\n/).map(function(l){return l.replace(/^\s+|\s+$/g,'');}).join('\n');},
    collapse:function(s){return s.split(/\n/).map(function(l){return l.replace(/[ \t]{2,}/g,' ');}).join('\n');},
    blank:function(s){return s.split(/\n/).filter(function(l){return l.trim()!=='';}).join('\n');},
    sort:function(s){return s.split(/\n/).sort(function(a,b){return a.localeCompare(b);}).join('\n');}
  };
  document.querySelectorAll('.ops button[data-op]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var op=btn.getAttribute('data-op');
      if(op==='clear'){T.value='';update();T.focus();return;}
      if(op==='copy'){
        T.select();
        var done=function(){var o=btn.textContent;btn.textContent=I.copied||'Copied';setTimeout(function(){btn.textContent=o;},1200);};
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(T.value).then(done,done);}else{try{document.execCommand('copy');}catch(e){}done();}
        return;
      }
      if(OPS[op]){T.value=OPS[op](T.value);update();}
    });
  });
  T.addEventListener('input',update);
  update();
})();
