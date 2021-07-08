module.exports = {
  // 成功提示
  apiSuccess(data = "", msg = "ok", code = 200) {
    this.body = { msg, data };
    this.status = code;
  },
  // 失败提示
  apiFail(data = "", msg = "fail", code = 400) {
    this.body = { msg, data };
    this.status = code;
  },
  //分页
  async page(modelName, where = {}, options = {}) {
    let page = this.query.page ? parseInt(this.query.page) : 1;
    let limit = this.query.limit ? parseInt(this.query.limit) : 10;
    let offset = (page - 1) * limit;

    if (!options.order) {
      options.order = [["id", "DESC"]];
    }

    let res = await this.app.model[modelName].findAndCountAll({
      where,
      offset,
      limit,
      ...options,
    });
    let pageEl = "";
    let totalPage = Math.ceil(res.count / limit);

    let query = { ...this.query };

    if (query.hasOwnProperty("page")) {
      delete query.page;
    }
    if (query.hasOwnProperty("limit")) {
      delete query.limit;
    }
    // 对象转&拼接字符串
    const urlEncode = (param, key, encode) => {
      if (param == null) return "";
      var paramStr = "";
      var t = typeof param;
      if (t == "string" || t == "number" || t == "boolean") {
        paramStr +=
          "&" +
          key +
          "=" +
          (encode == null || encode ? encodeURIComponent(param) : param);
      } else {
        for (var i in param) {
          var k =
            key == null
              ? i
              : key + (param instanceof Array ? "[" + i + "]" : "." + i);
          paramStr += urlEncode(param[i], k, encode);
        }
      }
      return paramStr;
    };
    query = urlEncode(query);
    const preDisabled = page <= 1 ? "disabled" : "";
    const nextDisabled = page >= totalPage ? "disabled" : "";
    for (let index = 1; index <= totalPage; index++) {
      let active = "";
      if (page === index) {
        active = "active";
      }
      pageEl += `<li class="page-item ${active}">
      <a class="page-link" href="?page=${index}&limit=${limit}${query}">${index}</a>
    </li>`;
    }

    let pageRender = `
      <ul class="pagination">
      <li class="page-item ${preDisabled}">
          <a class="page-link" href="?page=${
            page - 1
          }&limit=${limit}${query}" aria-label="Previous">
              <span aria-hidden="true">«</span>
              <span class="sr-only">Previous</span>
          </a>
      </li>
      ${pageEl}
      <li class="page-item ${nextDisabled}">
          <a class="page-link" href="?page=${
            page + 1
          }&limit=${limit}" aria-label="Next">
              <span aria-hidden="true">»</span>
              <span class="sr-only">Next</span>
          </a>
      </li>
  </ul>
    `;

    this.locals.pageRender = pageRender;
    return res.rows;
  },
  //渲染公共模板
  async renderTemplate(params = {}) {
    let toast = this.cookies.get("toast", {
      encrypt: true,
    });
    params.toast = toast ? JSON.parse(toast) : null;
    await this.render("admin/common/template.html", params);
  },
  toast(msg, type = "danger") {
    this.cookies.set("toast", JSON.stringify({ msg, type }), {
      maxAge: 1500,
      encrypt: true,
    });
  },
  //错误提示
  async pageFail(data = '',code= 404){
    return await this.render('admin/common/404.html',{data,code})
  }
};
