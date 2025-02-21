type ServerToClientEvents = {
  addMedia: (message: string) => void;
};

type ClientToServerEvents = {
  update: (message: string) => void;
};

export {ServerToClientEvents, ClientToServerEvents};
