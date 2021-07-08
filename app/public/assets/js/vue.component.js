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
      this.msg = options.msg || "";
      this.type = options.type || "danger";
      this.toast = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.hide();
        this.timer = null;
        if(options.success && typeof options.success === 'function'){
          options.success();
        }
      }, options.delay || 1500);
    },
    hide() {
      this.toast = false;
    },
  },
});

Vue.component("confirm", {
  template: `
  <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">{{title}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          {{content}}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="hide">取消</button>
          <button type="button" class="btn btn-primary" @click="confirm">确定</button>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      title: "提示",
      content: "",
    };
  },
  methods: {
    show(options = {}) {
      this.title = options.title || "";
      this.content = options.content;
      this.success = options.success || null;
      $("#exampleModalCenter").modal("show");
    },
    hide() {
      $("#exampleModalCenter").modal("hide");
    },
    confirm() {
      if (this.success && typeof this.success === "function") {
        this.success();
      }
    },
  },
});
