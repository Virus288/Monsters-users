import fakeData from './fakeData/fakeData.json';
import FakeFactory from './fakeFactory/src';
import Connection from './connections';

// eslint-disable-next-line import/prefer-default-export
export const generateRandomName = (): string => {
  const vocabulary = 'ABCDEFGHIJKLMNOUPRSTUWZabcdefghijklmnouprstuwz';
  let name = '';
  for (let x = 0; x < 12; x++) {
    name += vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  return name;
};

export { fakeData, Connection, FakeFactory };
