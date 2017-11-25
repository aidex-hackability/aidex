'''
    Aidex Emergency Call UDP server
    Ref: http://www.binarytides.com/programming-udp-sockets-in-python/
    This is for pre python 3.6 
'''

import socket
import sys
import os

# ref; https://docs.python.org/3/howto/logging-cookbook.html
import logging
logger = logging.getLogger('AidexUDPServer')
#logging.basicConfig(level=logging.DEBUG)
logging.basicConfig(level=logging.INFO)


HOST = ''   # Symbolic name meaning all available interfaces
PORT = 9876  # matching the java client

class AidexUDPCommand():
    def __init__(self):
        # use proper property later
        self.stressResp = 0x63    # placeholder for now
        self.stressSignal = 0x61  # change it to 0xF2 later
        self.stressConfirm = 0x62  # change it to 0xF4
        self.exitCmd = 0x7A # a fake exit command for debugging

        self.stressState = False

        self.funTbl = {
            self.stressSignal: self.handleStressSignal,
            self.stressConfirm: self.handleStressConfirm,
            self.exitCmd: self.handleExit
        }

    def dispatch(self,cmd):
        resp = b'z' # exit program code, same as cmd 0x7A
        ind = ord(cmd); # just to be save
        try:
            resp = self.funTbl[ind]()
        except KeyError as err:
            #logger.error('Failed to look up command. Error: ' + str(err))
            self.handleError(cmd)
        
        return cmd

    def handleError(self,cmd):
        logger.debug("Unregistered command from client: " + cmd.decode() )
        return cmd

    def handleStressSignal(self):
        logger.info('Stress signal received')
        self.stressState = True;
        # play a audio clip here
        os.system('aplay help1.wav &')
        return self.stressResp.to_bytes(1, byteorder='big')

    def handleStressConfirm(self):
        if self.stressState:
            logger.info('Stress signal confirmed')
            # play another audio clip here
            os.system('aplay help2.wav &')
            
            return self.stressResp.to_bytes(1, byteorder='big')
        else:
            # false alarm
            self.stressState = False
            return cmd


    def handleExit(self):
        return b'z'

    

class AidexUDPServer(object):        
    def __init__(self,host=None,port=None):
        logger.info('__init__')

        # use property later
        if host == None:
            self.host = ''
        else:
            self.host = HOST

        if port == None:
            self.port = PORT
        else:
            self.port = port

        self.sock = None
        self.data = None
        self.addr = None
        self.stressSTATE = False

        self.command = AidexUDPCommand()

    
    def __del__(self):
        self.closeSocket()
    
    def createSocket(self):
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            logger.info('Socket created')
        except socket.error as msg:
            logger.error('Failed to create socket. Error: ' + str(msg))
            sys.exit()
        
        try:
            self.sock.bind((self.host, self.port))
        except socket.error as msg:
            logger.error('Bind failed. Error: ' + str(msg))
            sys.exit()

    def recv(self):
        d = self.sock.recvfrom(1024)
        self.data = d[0]
        self.addr = d[1]

        if not self.data:
            logger.error("no data!")

        logger.debug("data recv: " + self.data.decode())
        return self.data

        #resp = self.dispatch(self.data)
        # based on resp do some socket stuff ... send reply etc.

    def dispatch(self):
        cmd = self.recv()
        resp = self.command.dispatch(cmd)
        logger.debug("from dispatch: " + resp.decode())
        return resp

    def send(self,msg):
        # check is any of self.sock, self.addr is None later
        if (self.sock != None) and (self.addr != None):
            logger.debug("data send: " + msg.decode())
            self.sock.sendto(msg, self.addr)
        else:
            logger.error('Send error: socket and/or return addr not ready!')

    def closeSocket(self):
        if self.sock != None:
            self.sock.close()

def main():
    # let's put some test together
    serv = AidexUDPServer()
    serv.createSocket()

    logger.info("entering the event loop")
    cont = True
    while cont:
        resp = serv.dispatch()
        if ord(resp) == 0x7A: # 'z' for testing
            cont = False
        serv.send(resp)
    else:
        pass

    logger.info("exit the event loop")
    
    logger.info("close the socket and exit")
    serv.closeSocket()

if __name__ == '__main__':
    main()
'''
# Datagram (udp) socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print('Socket created')
except socket.error as msg:
    print('Failed to create socket. Error Code : ' +
          str(msg[0]) + ' Message ' + msg[1])
    sys.exit()


# Bind socket to local host and port
try:
    s.bind((HOST, PORT))
except socket.error as msg:
    print('Bind failed. Error Code : ' + str(msg[0]) + ' Message ' + msg[1])
    sys.exit()

print('Socket bind to port ' + str(PORT) + ' complete')

# const for replay
stressResp = 0x63    # placeholder for now
stressSignal = 0x61  # change it to 0xF2 later
stressConfirm = 0x62  # change it to 0xF4

# State
streeState = False


def sendReply(sock, msg, msgFrom):
    #reply = b'OK...' + msg
    #sock.sendto(reply , msgFrom)
    print('Message[' + str(msgFrom[0]) + ':' +
          str(msgFrom[1]) + '] - ' + msg.strip().decode("utf-8"))
    #reply = b'Signal received: ' + msg
    reply = msg
    sock.sendto(reply, msgFrom)


#now keep talking with the client
while 1:
    # receive data from client (data, addr)
    d = s.recvfrom(1024)
    data = d[0]
    addr = d[1]

    if not data:
        print("no data!")

    if streeState:
        # check for the stress confirmation signal
        if data[0] == stressConfirm:
            print('stress signal confirmed')
            sendReply(s, stressResp.to_bytes(1, byteorder='big'), addr)
            streeState = False  # reset state
            os.system('aplay help2.wav &')
        else:
            # false alarm
            streeState = False  # reset state (this is a risk here)
    else:
        # business as usual
        if data[0] == stressSignal:
            print('got a stress call!')
            sendReply(s, stressResp.to_bytes(1, byteorder='big'), addr)
            streeState = True
            # play some music here
            os.system('aplay help1.wav &')
        else:
            sendReply(s, data, addr)

s.close()
'''

