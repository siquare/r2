// tslint:disable-next-line:import-name
import fetch, { RequestInit as FetchRequestInit } from 'node-fetch';
import { getLogger } from './logger';

export default class WebClient {
  private log = getLogger('WebClient');

  constructor(public baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(path: string, init: FetchRequestInit = {}, verbose: boolean = true): Promise<T> {
    const url = this.baseUrl + path;
    this.log.debug(`Sending HTTP request... URL: ${url} Request: ${JSON.stringify(init)}`);
    const res = await fetch(url, init);
    let logText = `Response from ${res.url}. ` +
      `Status Code: ${res.status} (${res.statusText}) `;
    this.log.debug(logText);
    const content = await res.text();
    if (!res.ok) {
      if (res.status === 525) {
        this.log.debug(`HTTP request failed but status code is 525. So retrying. ${logText}`);
        return await this.fetch<T>(path, init, verbose);
      }

      logText += `Content: ${content}`;
      throw new Error(`HTTP request failed. ${logText}`);
    }
    if (!content) {
      return {} as T;
    }
    const t = JSON.parse(content) as T;
    if (verbose) {
      this.log.debug(`Response content from ${res.url}: ${JSON.stringify(t)}`);
    }
    return t;
  }
}
