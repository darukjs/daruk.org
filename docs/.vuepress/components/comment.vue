<template>
  <div class="gitalk-container">
    <div id="gitalk-container"></div>
  </div>
</template>
<script>
export default {
  name: "comment",
  data() {
    return {};
  },
  mounted() {
    let body = document.querySelector(".gitalk-container");
    let script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js";
    body.appendChild(script);
    script.onload = () => {
      const commentConfig = {
        clientID: "9202e95e28b2e9465d8e",
        clientSecret: "f85f0a9a4bc4af484a26cb74d1587d0f4193c298",
        repo: "daruk.org",
        owner: "xiaojue",
        // 这里接受一个数组，可以添加多个管理员
        admin: ["xiaojue"],
        // id 用于当前页面的唯一标识，一般来讲 pathname 足够了，

        // 但是如果你的 pathname 超过 50 个字符，GitHub 将不会成功创建 issue，此情况可以考虑给每个页面生成 hash 值的方法.
        id: location.pathname,
        distractionFreeMode: false,
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render("gitalk-container");
    };
  },
};
</script>
