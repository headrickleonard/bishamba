import React from 'react';
import { View } from 'react-native';
import { Button, Dialog, IconButton, Paragraph, Provider } from 'react-native-paper';

export default CustomDialog = ({ visible, onDismiss, type, message }) => {
  return (
    <Provider>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{type === 'error' ? 'Error' : 'Success'}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Provider>
  );
};


