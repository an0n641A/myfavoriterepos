import {useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import Request from '../interfaces/request.interface';

const useAxios = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const request = async ({
    baseURL,
    method,
    body = '{}',
    headers,
  }: Request): Promise<any> => {
    try {
      setLoading(true);
      let res: AxiosResponse;
      if (headers) {
        //@ts-ignore
        res = await axios[method](
          baseURL,
          JSON.parse(headers),
          JSON.parse(body),
        );
      } else {
        //@ts-ignore
        res = await axios[method](baseURL, JSON.parse(body));
      }
      return res.data;
    } catch (err) {
      let message = 'Something went wrong upon request...';
      if (err instanceof Error) {
        message = err.message;
      }
      console.log('error', message);
      setError(message);
      setLoading(false);
      throw new Error('No results to display');
    } finally {
      setLoading(false);
    }
  };

  return {error, loading, request};
};

export default useAxios;
