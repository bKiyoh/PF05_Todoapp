
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

new Vue({
  el: '#app',

  data: {
    todos: [],
    // 初期値を「-1」=「すべて」にする
    current: -1,
    options: [
      { value: -1, label: 'All' },
      { value: 0, label: '🤷‍♂️' },
      { value: 1, label: '👌' },
    ],
    topYear: '',
    topMonth: '',
    topDay: '',
    realDay: '',
    realTime: ''
  },

  mounted: function () {
    let timerID = setInterval(this.updateTime, 1000);
  },

  computed: {

    computedTodos: function () {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },

    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
    }
  },

  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      //引数はウォッチしているプロパティの変換後の値
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // deepオプションでネストしているデータも監視できる
      deep: true
    }
  },

  created() {
    //インスタンス作成時に自動的に fetch()する
    this.todos = todoStorage.fetch()
  },

  methods: {

    //現在の日時（リアルタイム）
    updateTime: function () {
      //現在の日付・時刻を取得
      var currentDate = new Date();
      //top
      this.topYear = currentDate.getFullYear() + "年";
      this.topMonth = (currentDate.getMonth() + 1) + "月";
      this.topDay = currentDate.getDate();
      //現在日付
      this.realDay = currentDate.getFullYear() + "/" + (('0' + currentDate.getMonth() + 1)).slice(-2) + "/" + ('0' + currentDate.getDate()).slice(-2) + "/" + ('0' + currentDate.getHours()).slice(-2) + ":" + ('0' + currentDate.getMinutes()).slice(-2) + ":" + ('0' + currentDate.getSeconds()).slice(-2);
    },

    //Todo 追加の処理
    doAdd: function (event, value) {

      //登録した日時・時間を表示する
      var addDate = new Date();
      var addDay = addDate.getFullYear() + "/" + (('0' + addDate.getMonth() + 1)).slice(-2) + "/" + ('0' + addDate.getDate()).slice(-2) + "/" + ('0' + addDate.getHours()).slice(-2) + ":" + ('0' + addDate.getMinutes()).slice(-2) + ":" + ('0' + addDate.getSeconds()).slice(-2);

      // refで名前を付けておいた要素を参照
      var comment = this.$refs.comment
      // 入力がなければ何もしない return
      if (!comment.value.length) {
        return
      }

      // オブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        addDay: addDay,
        state: 0,
      })
      // フォーム要素を空にする
      comment.value = ''
    },

    // 状態変更の処理
    doChangeState: function (item) {
      item.state = item.state ? 0 : 1
    },

    // 削除の処理
    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    },

  }
})
