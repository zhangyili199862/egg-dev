Vue.component("toast", {
  template: `
    <div role="alert" class="alert" :class="c" style="position: fixed;right: 0;top: 70px;z-index: 10000;" v-if="toast">
    {{ msg }}
</div>
    `,
  data() {
    return {
      msg: "",
      toast: false,
      timer: null,
      type: "danger",
    };
  },
  computed: {
    c() {
      return `alert-${this.type}`;
    },
  },
  methods: {
    show(options) {
      console.log("123");
      this.msg = options.msg || "";
      this.type = options.type || "danger";
      this.toast = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.hide();
        this.timer = null;
      }, options.delay || 1500);
    },
    hide() {
      this.toast = false;
    },
  },
});
