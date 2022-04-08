import ThunderJS from 'ThunderJS';

const config = {
    host: '127.0.0.1',
    port: 9998,
    default: 1,
    versions: {
      'org.rdk.System': 2
    }
  }
  const thunder = ThunderJS(config)

  export default thunder;