<style scoped></style>

<template>
  <div class="table-responsive">
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article._id">
          <td>{{ article.title }}</td>
          <td>{{ article.description }}</td>
          <td>
            <button class="btn btn-success" @click="sendArticle(article)">
              SELECT
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      articles: [],
    };
  },
  created: async function() {
    axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer: ${this.$store.state.token}`;
    await axios
      .get("/article/", {
        headers: {
          Authorization: `Bearer: ${this.$store.state.token}`,
        },
      })
      .then(response => {
        this.articles = response.data.data;
        console.log(response.data.data);
      })
      .catch(e => console.log(e));
  },
  methods: {
    sendArticle(article) {
      console.log(article);
      this.$emit("data", article);
    },
  },
};
</script>
