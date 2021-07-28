export const env = process.env.APP_ENV

const hosts = {
  local: {
    url: "http://localhost:3003/api/v1",
  },
  development: {
    url: "http://localhost:3003/api/v1",
  },
  production: {
    url: `http://localhost:3003/api/v1`,
  },
};

// @ts-ignore
export const getHost = () => hosts[env] || hosts.production

const config = {
  urls: {
    charts: `${getHost().url}/charts`
  },
}

export const urls = config.urls
