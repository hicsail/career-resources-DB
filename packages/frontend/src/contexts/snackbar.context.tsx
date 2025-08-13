import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export interface Message {
  message: string;
  id?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export interface SnackbarContextType {
  push: (message: Message) => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({} as SnackbarContextType);

export interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: FC<SnackbarProviderProps> = (props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const push = useCallback((message: Message) => {
    if (!message.id) {
      message.id = new Date().getTime().toString();
    }
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleClose = (id?: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  return (
    <SnackbarContext.Provider value={{ push }}>
      <>
        {props.children}
        {messages.map((message) => (
          <Snackbar key={message.id} open={true} autoHideDuration={6000} onClose={() => handleClose(message.id)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => handleClose(message.id)} severity={message.type || 'success'} variant="filled" sx={{ width: '100%' }}>
              {message.message}
            </Alert>
          </Snackbar>
        ))}
      </>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);