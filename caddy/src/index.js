// fetch("http://127.0.0.1:9311/api")
//   .then((res) => res.json())
//   .then((json) => {
//     console.log(json);
//   });

import axios from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

function axiosPending() {
  axios
    .get("http://local.com/pending", {
      cancelToken: source.token,
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      } else {
        // handle error
      }
    });
}
window.axiosCancel = () => {
  source.cancel("Operation canceled now!!!");
};
window.axiosPending = axiosPending;
