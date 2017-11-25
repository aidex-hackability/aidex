'''
    Aidex Emergency Call UDP server
    Ref: http://www.binarytides.com/programming-udp-sockets-in-python/
    This is for pre python 3.6 
'''

import socket
import sys
import os
# note: find a good logger library

#HOST = ''   # Symbolic name meaning all available interfaces
#PORT = 9876  # matching the java client

class AidexUDPCommand():
    def __init__(self):
        # use proper property later
        self.stressResp = 0x63    # placeholder for now
        self.stressSignal = 0x61  # change it to 0xF2 later
        self.stressConfirm = 0x62  # change it to 0xF4

        self.funTbl = {
            self.stressResp: handleStressSignal,
            self.stressConfirm: handleStressConfirm
        }

    def dispatch(cmd):
        resp = 0xff # error code?
        try:
            resp = self.funTbl[cmd]()
        except KeyError as err:
            handleError()
        
        return resp


    def handleError():
        print("[AidexUDPCommand]: Unkown command from client.")
        pass

    def handleStressSignal():
        pass

    def handleStressConfirm():
        pass

    

class AidexUDPServer(object):
    def __init__(self,host,port):
        # use property later
        if host == None:
            self.host = ''
        else:
            self.host = host

        if port == None:
            self.port = 9876
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
            print('Socket created')
        except socket.error as msg:
            print('Failed to create socket. Error Code : ' 
                + str(msg[0]) + ' Message ' + msg[1])
            sys.exit()
        
        try:
            self.sock.bind((self.host, self.port))
        except socket.error as msg:
            print('Bind failed. Error Code : ' + str(msg[0]) + ' Message ' + msg[1])
            sys.exit()

    def recv(self):
        d = self.sock.recvfrom(1024)
        self.data = d[0]
        self.addr = d[1]

        if not self.data:
            print("[AidexUDPServer:recv()] no data!")

        resp = self.dispatch(self.data)
        # based on resp do some socket stuff ... send reply etc.

    def dispatch(self, cmd):
        self.command.dispatch(cmd)

    def send(self,msg):
        # check is any of self.sock, self.addr is None later
        if (self.sock != None) and (self.addr != None):
            self.sock.sendto(msg.encode(), self.addr)
        else:
            pass # do something like raise an Exception

    def closeSocket(self):
        if self.sock != None:
            self.sock.close()



def main():
    pass


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

