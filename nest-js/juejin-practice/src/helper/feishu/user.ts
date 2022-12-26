import { methodV } from '../../utils/request';
export enum RECEIVE_TYPE {
  'open_id',
  'user_id',
  'union_id',
  'email',
  'chat_id',
}

export enum MSG_TYPE {
  text,
  port,
  image,
  file,
  audio,
  media,
  sticker,
  interactive,
  share_chat,
  share_user,
}

interface MESSAGES_PARAMS {
  receive_id: string;
  content: string;
  msg_type: MSG_TYPE;
}

export const messages = async (
  receiveIdType: RECEIVE_TYPE,
  params: MESSAGES_PARAMS,
  appToken: string,
) => {
  const { data } = await methodV({
    url: `/im/v1/messages`,
    method: 'POST',
    query: {
      receive_id_type: receiveIdType,
    },
    params,
    headers: {
      Authorization: `Bearer ${appToken}`,
    },
  });
  return data;
};
