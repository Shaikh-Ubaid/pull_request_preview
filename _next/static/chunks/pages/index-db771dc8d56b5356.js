(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(8094)}])},8094:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return X}});var r=t(4051),a=t.n(r),o=t(5893),c=t(6306),u=t(2959),s=t(1889),l=t(8504),d=t(6713),_=t(4842),m=t(882),p={basic:{expr2:"program expr2\n    implicit none\n\n    integer :: x\n\n    x = (2+3)*5\n    print *, x\nend program",mandelbrot:'program mandelbrot\n    integer, parameter :: Nx = 600, Ny = 450, n_max = 255, dp=kind(0.d0)\n    real(dp), parameter :: xcenter = -0.5_dp, ycenter = 0.0_dp, &\n        width = 4, height = 3, dx_di = width/Nx, dy_dj = -height/Ny, &\n        x_offset = xcenter - (Nx+1)*dx_di/2, y_offset = ycenter - (Ny+1)*dy_dj/2\n    integer :: image(Nx,Ny), image_color(4,Nx,Ny), palette(3,4), i, j, n, idx\n    real(dp) :: x, y, x_0, y_0, x_sqr, y_sqr\n    interface\n        subroutine show_img(w, h, A) bind(c)\n        integer, intent(in) :: w, h\n        integer, intent(in) :: A(w,h)\n        end subroutine\n        subroutine show_img_color(w, h, A) bind(c)\n        integer, intent(in) :: w, h\n        integer, intent(in) :: A(4,w,h)\n        end subroutine\n    end interface\n    do j = 1, Ny\n        y_0 = y_offset + dy_dj * j\n        do i = 1, Nx\n            x_0 = x_offset + dx_di * i\n            x = 0; y = 0; n = 0\n            do\n                x_sqr = x ** 2; y_sqr = y ** 2\n                if (x_sqr + y_sqr > 4 .or. n == n_max) then\n                    image(i,j) = 255-n\n                    exit\n                end if\n                y = y_0 + 2 * x * y\n                x = x_0 + x_sqr - y_sqr\n                n = n + 1\n            end do\n        end do\n    end do\n    palette(1,1) =   0; palette(2,1) = 135; palette(3,1) =  68\n    palette(1,2) =   0; palette(2,2) =  87; palette(3,2) = 231\n    palette(1,3) = 214; palette(2,3) =  45; palette(3,3) =  32\n    palette(1,4) = 255; palette(2,4) = 167; palette(3,4) =   0\n    do j = 1, Ny\n        do i = 1, Nx\n            idx = image(i,j) - (image(i,j)/4)*4 + 1\n            image_color(1,i,j) = palette(1,idx) ! Red\n            image_color(2,i,j) = palette(2,idx) ! Green\n            image_color(3,i,j) = palette(3,idx) ! Blue\n            image_color(4,i,j) = 255            ! Alpha\n        end do\n    end do\n    print *, "The Mandelbrot image in color:"\n    call show_img_color(Nx, Ny, image_color)\n    print *, "The Mandelbrot image in grayscale:"\n    call show_img(Nx, Ny, image)\n    print *, "Done."\nend program mandelbrot'},experimental:{template_add:'module template_add_m\n    implicit none\n    private\n    public :: add_t\n\n    requirement R(T, F)\n        type :: T; end type\n        function F(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n        end function\n    end requirement\n\n    template add_t(T, F)\n        requires R(T, F)\n        private\n        public :: add_generic\n    contains\n        function add_generic(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n            z = F(x, y)\n        end function\n    end template\n\ncontains\n\n    real function func_arg_real(x, y) result(z)\n        real, intent(in) :: x, y\n        z = x + y\n    end function\n\n    integer function func_arg_int(x, y) result(z)\n        integer, intent(in) :: x, y\n        z = x + y\n    end function\n\n    subroutine test_template()\n        instantiate add_t(real, func_arg_real), only: add_real => add_generic\n        real :: x, y\n        integer :: a, b\n        x = 5.1\n        y = 7.2\n        print*, "The result is ", add_real(x, y)\n        if (abs(add_real(x, y) - 12.3) > 1e-5) error stop\n\n        instantiate add_t(integer, func_arg_int), only: add_integer => add_generic\n        a = 5\n        b = 9\n        print*, "The result is ", add_integer(a, b)\n        if (add_integer(a, b) /= 14) error stop\n    end subroutine\nend module\n\nprogram template_add\nuse template_add_m\nimplicit none\n\ncall test_template()\n\nend program template_add',template_nested:'module template_nested_m\n    implicit none\n    private\n    public :: add_t\n\n    requirement R(T, F)\n        type :: T; end type\n        function F(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n        end function\n    end requirement\n\n    template add_t(T, F)\n        requires R(T, F)\n        private\n        public :: add_generic\n    contains\n        function add_generic(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n            z = F(x, y)\n        end function\n        function call_add_generic(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n            z = add_generic(x, y)\n        end function\n    end template\n\ncontains\n\n    real function func_arg_real(x, y) result(z)\n        real, intent(in) :: x, y\n        z = x + y\n    end function\n\n    subroutine test_template()\n        instantiate add_t(real, func_arg_real), only: add_real => call_add_generic\n        real :: x, y\n        integer :: a, b\n        x = 5.1\n        y = 7.2\n        print*, "The result is ", add_real(x, y)\n        if (abs(add_real(x, y) - 12.3) > 1e-5) error stop\n    end subroutine\nend module\n\nprogram template_nested\nuse template_nested_m\nimplicit none\n\ncall test_template()\n\nend program template_nested'}},f=t(5152),h=t.n(f),g=c.Z.TabPane,x=h()(Promise.all([t.e(281),t.e(275),t.e(286)]).then(t.bind(t,2286)),{loadableGenerated:{webpack:function(){return[2286]}},ssr:!1});var y=function(e){var n=function(e){var n=function(n){t.push({key:n,label:n,onClick:function(){i(p[e][n])}})},t=[];for(var r in p[e])n(r);y.push({key:e,label:e,children:t})},t=e.disabled,r=e.sourceCode,i=e.setSourceCode,a=e.activeTab,f=e.handleUserTabChange,h=e.myHeight,y=[];for(var b in p)n(b);var v=(0,o.jsx)(u.Z,{items:y}),w={right:(0,o.jsxs)(s.Z,{disabled:t,onClick:function(){return f(a)},children:[" ",(0,o.jsx)(_.Z,{})," Run "]}),left:(0,o.jsx)(l.Z,{overlay:v,trigger:"hover",children:(0,o.jsx)("a",{onClick:function(e){return e.preventDefault()},children:(0,o.jsxs)(d.Z,{style:{marginRight:"10px"},children:["Examples ",(0,o.jsx)(m.Z,{})]})})})};return(0,o.jsx)("div",{className:"card-container",style:{height:"100%"},children:(0,o.jsx)(c.Z,{tabBarExtraContent:w,style:{height:"100%"},children:(0,o.jsx)(g,{tab:"main.f90",style:{height:h},children:(0,o.jsx)(x,{sourceCode:r,setSourceCode:i})},"1")})})},b=t(7132),v=t(5439);var w=function(e){var n=e.activeTab,t=e.output,r=e.handleUserTabChange,i=e.myHeight;return(0,o.jsxs)("div",{className:"card-container",children:[(0,o.jsx)(v.Z,{block:!0,style:{margin:"6px 0px 22px 0px"},options:["STDOUT","AST","ASR","WAT","CPP","PY"],value:n,onChange:function(e){return r(e)}}),(0,o.jsx)(s.Z,{onClick:function(){navigator.clipboard.writeText(t)},style:{position:"absolute",right:"40px",top:"80px"},children:(0,o.jsx)(b.Z,{})}),(0,o.jsx)("pre",{style:{margin:"0px",height:i,overflow:"scroll",border:"1px solid black"},children:(0,o.jsx)("div",{id:"outputBox",style:{minHeight:"100%",fontSize:"0.9em",padding:"10px"},dangerouslySetInnerHTML:{__html:t}})})]})},T=t(4298),j=t.n(T),R=t(7294);function S(e,n,t,r,i,a,o){try{var c=e[a](o),u=c.value}catch(s){return void t(s)}c.done?n(u):Promise.resolve(u).then(r,i)}function k(e){return function(){var n=this,t=arguments;return new Promise((function(r,i){var a=e.apply(n,t);function o(e){S(a,r,i,o,c,"next",e)}function c(e){S(a,r,i,o,c,"throw",e)}o(void 0)}))}}function E(){return new Promise((function(e,n){Module.onRuntimeInitialized=function(){e({emit_ast_from_source:Module.cwrap("emit_ast_from_source","string",["string"]),emit_asr_from_source:Module.cwrap("emit_asr_from_source","string",["string"]),emit_wat_from_source:Module.cwrap("emit_wat_from_source","string",["string"]),emit_cpp_from_source:Module.cwrap("emit_cpp_from_source","string",["string"]),emit_py_from_source:Module.cwrap("emit_wat_from_source","string",["string"]),emit_wasm_from_source:Module.cwrap("emit_wasm_from_source","string",["string"])})}}))}function N(e,n,t,r){var i=function(e){return n.push(e.toString())},a=function(){r(n.join(" ")+"\n"),n.length=0};return{js:{memory:e,print_i32:i,print_i64:i,print_f32:i,print_f64:i,print_str:function(t,r){return n.push(new TextDecoder("utf8").decode(new Uint8Array(e.buffer,t,r)))},flush_buf:a,set_exit_code:function(e){return t.val=e},cpu_time:function(e){return Date.now()/1e3},show_img:function(t,r,i){var o=new DataView(e.buffer,i,Int32Array.BYTES_PER_ELEMENT*r*t),c=document.createElement("CANVAS");c.width=t,c.height=r;for(var u=c.getContext("2d"),s=u.createImageData(t,r),l=0;l<s.data.length;l+=4)s.data[l+0]=o.getInt32(l,!0),s.data[l+1]=o.getInt32(l,!0),s.data[l+2]=o.getInt32(l,!0),s.data[l+3]=255;u.putImageData(s,0,0),n.push('<img alt="constructed image" src="'.concat(c.toDataURL("image/jpeg"),'" height="').concat(r,'" width="').concat(t,'" style="aspect-ratio: 1 / 1;"/>')),a()},show_img_color:function(t,r,i){var o=new DataView(e.buffer,i,4*Int32Array.BYTES_PER_ELEMENT*r*t),c=document.createElement("CANVAS");c.width=t,c.height=r;for(var u=c.getContext("2d"),s=u.createImageData(t,r),l=0;l<s.data.length;l++)s.data[l]=o.getInt32(4*l,!0);u.putImageData(s,0,0),n.push('<img alt="constructed image" src="'.concat(c.toDataURL("image/jpeg"),'" height="').concat(r,'" width="').concat(t,'" style="aspect-ratio: 1 / 1;"/>')),a()}}}}function A(e,n){return C.apply(this,arguments)}function C(){return(C=k(a().mark((function e(n,t){var r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,WebAssembly.instantiate(n,t);case 3:r=e.sent,(0,r.instance.exports._lcompilers_main)(),e.next=11;break;case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",e.t0);case 11:return e.abrupt("return","Success");case 12:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function z(e,n){return P.apply(this,arguments)}function P(){return P=k(a().mark((function e(n,t){var r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E();case 2:r=e.sent,n.emit_ast_from_source=function(e){try{return r.emit_ast_from_source(e)}catch(n){return console.log(n),t(n+"\nERROR: AST could not be generated from the code"),0}},n.emit_asr_from_source=function(e){try{return r.emit_asr_from_source(e)}catch(n){return console.log(n),t(n+"\nERROR: ASR could not be generated from the code"),0}},n.emit_wat_from_source=function(e){try{return r.emit_wat_from_source(e)}catch(n){return console.log(n),t(n+"\nERROR: WAT could not be generated from the code"),0}},n.emit_cpp_from_source=function(e){try{return r.emit_cpp_from_source(e)}catch(n){return console.log(n),t(n+"\nERROR: CPP could not be generated from the code"),0}},n.emit_py_from_source=function(e){try{return r.emit_py_from_source(e)}catch(n){return console.log(n),t(n+"\nERROR: LLVM could not be generated from the code"),0}},n.compile_code=function(e){try{return r.emit_wasm_from_source(e)}catch(n){return console.log(n),t(n+"\nERROR: The code could not be compiled. Either there is a compile-time error or there is an issue at our end."),0}},n.execute_code=function(){var e=k(a().mark((function e(n,r){var i,o,c,u,s;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i={val:1},o=[],c=new WebAssembly.Memory({initial:100,maximum:100}),u=N(c,o,i,r),e.next=6,A(n,u);case 6:if(s=e.sent,0!=i.val){e.next=9;break}return e.abrupt("return",1);case 9:return console.log(s),t(s+"\nERROR: The code could not be executed. Either there is a runtime error or there is an issue at our end."),e.abrupt("return",0);case 12:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}();case 10:case"end":return e.stop()}}),e)}))),P.apply(this,arguments)}var M=function(e){var n=e.moduleReady,t=e.setModuleReady,r=e.lfortran_funcs,i=e.openNotification,c=e.myPrint,u=e.handleUserTabChange,s=(0,R.useCallback)(k(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z(r,c);case 2:t(!0),i("LFortran Module Initialized!","bottomRight"),console.log("LFortran Module Initialized!"),u("STDOUT");case 6:case"end":return e.stop()}}),e)}))),[n]);return(0,o.jsx)("div",{children:(0,o.jsx)(j(),{src:"./lfortran.js",onLoad:s})})};var I=t(6317),U=t(6226),Z=t(1382),D=t(9614),O=t(888),q=t(4431);function F(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function L(e,n,t,r,i,a,o){try{var c=e[a](o),u=c.value}catch(s){return void t(s)}c.done?n(u):Promise.resolve(u).then(r,i)}function H(e){return function(){var n=this,t=arguments;return new Promise((function(r,i){var a=e.apply(n,t);function o(e){L(a,r,i,o,c,"next",e)}function c(e){L(a,r,i,o,c,"throw",e)}o(void 0)}))}}function W(e){return function(e){if(Array.isArray(e))return e}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,n){if(!e)return;if("string"===typeof e)return F(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return F(e,n)}(e,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var B=new(t.n(q)()),V=(0,o.jsx)(O.Z,{style:{fontSize:24},spin:!0}),Y=function(e,n){D.Z.info({message:e,placement:n})},G={emit_ast_from_source:null,emit_asr_from_source:null,emit_wat_from_source:null,emit_wasm_from_source:null,emit_cpp_from_source:null,emit_py_from_source:null,compile_code:null,execute_code:null};function X(){var e=(0,R.useState)(!1),n=e[0],t=e[1],r=(0,R.useState)(p.basic.mandelbrot),i=r[0],c=r[1],u=(0,R.useState)("STDOUT"),s=u[0],l=u[1],d=(0,R.useState)(""),_=d[0],m=d[1],f=function(){var e=(0,R.useState)(!1),n=e[0],t=e[1];return(0,R.useEffect)((function(){var e=function(){var e=window.innerWidth<768;t(e)};return e(),window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[]),n}()?"calc(50vh - 85px)":"calc(100vh - 170px)";function h(e){return g.apply(this,arguments)}function g(){return(g=H(a().mark((function e(n){var t,r,o,c,u,s,d,_,p;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("STDOUT"!=n){e.next=19;break}if(""!==i.trim()){e.next=5;break}return m("No Source Code to compile"),l(n),e.abrupt("return");case 5:if(!(t=G.compile_code(i))){e.next=17;break}if(r=W(t.split(",")),o=r[0],c=r.slice(1),"0"===o){e.next=12;break}m(B.ansi_to_html(c)),e.next=17;break;case 12:return u=[],e.next=15,G.execute_code(new Uint8Array(c),(function(e){return u.push(e)}));case 15:e.sent&&m(u.join(""));case 17:e.next=20;break;case 19:"AST"==n?(s=G.emit_ast_from_source(i))&&m(B.ansi_to_html(s)):"ASR"==n?(d=G.emit_asr_from_source(i))&&m(B.ansi_to_html(d)):"WAT"==n?(_=G.emit_wat_from_source(i))&&m(B.ansi_to_html(_)):"CPP"==n?(p=G.emit_cpp_from_source(i))&&m(B.ansi_to_html(p)):"PY"==n?m("Support for PY is not yet enabled"):(console.log("Unknown key:",n),m("Unknown key: "+n));case 20:l(n);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(M,{moduleReady:n,setModuleReady:t,lfortran_funcs:G,openNotification:Y,myPrint:m,handleUserTabChange:h}),(0,o.jsxs)(I.Z,{gutter:[16,16],children:[(0,o.jsx)(U.Z,{xs:{span:24},sm:{span:24},md:{span:12},children:(0,o.jsx)(y,{disabled:!n,sourceCode:i,setSourceCode:c,activeTab:s,handleUserTabChange:h,myHeight:f})}),(0,o.jsx)(U.Z,{xs:{span:24},sm:{span:24},md:{span:12},children:n?(0,o.jsx)(w,{activeTab:s,output:_,handleUserTabChange:h,myHeight:f}):(0,o.jsx)("div",{style:{height:f},children:(0,o.jsx)(Z.Z,{style:{position:"relative",top:"50%",left:"50%"},indicator:V})})})]})]})}}},function(e){e.O(0,[637,774,888,179],(function(){return n=5557,e(e.s=n);var n}));var n=e.O();_N_E=n}]);