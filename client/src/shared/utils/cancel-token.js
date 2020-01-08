import axios from 'axios';

const cancelToken = () => ({
  instance: null,
  cancel() {
    if (this.instance) this.instance.cancel();
    this.instance = axios.CancelToken.source();
  }
});

export default cancelToken;
