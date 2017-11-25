'''
    Aidex Emergency Call UDP server
    Ref: http://www.binarytides.com/programming-udp-sockets-in-python/
    for version Python 3.6+
'''

import socket
import sys

import os

HOST = ''   # Symbolic name meaning all available interfaces
PORT = 9876  # matching the java client

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

#print(f'Socket bind to port {PORT} complete')
print('Socket bind to port ' + str(PORT) + ' complete')

# const for replay
stressResp = 0x63    # placeholder for now
stressSignal = 0x61  # change it to 0xF2 later
stressConfirm = 0x62  # change it to 0xF4

# State
stressState = False


def sendReply(sock, msg, msgFrom):
    #reply = b'OK...' + msg
    #sock.sendto(reply , msgFrom)
    print('Message[' + str(msgFrom[0]) + ':' +
          str(msgFrom[1]) + '] - ' + msg.strip().decode("utf-8"))
    #reply = b'Signal received: ' + msg
    reply = msg
    sock.sendto(reply, msgFrom)

# need some factoring here
def processStressCall(signal, data, sock, addr):
    byte=data[0]
    if byte == signal:
        sendReply(sock, stressResp.to_bytes(1, byteorder='big'), addr)
        return True
    else:
        sendReply(sock, data, addr)
        return False

#now keep talking with the client
while 1:
    # receive data from client (data, addr)
    d = s.recvfrom(1024)
    data = d[0]
    addr = d[1]

    if not data:
        print("no data!")

    if stressState:
        # check for the stress confirmation signal
        if data[0] == stressConfirm:
            print('stress signal confirmed')
            sendReply(s, stressResp.to_bytes(1, byteorder='big'), addr)
            stressState = False  # reset state
            os.system('aplay help2.wav &')
            #status = processStressCall(stressConfirm, data, s, addr)
            #if status == True:

        else:
            # false alarm
            #stressState = False  # reset state (this is a risk here)
            #stressState = processStressCall(stressSignal, data, s, addr)
            pass

    else:
        status = processStressCall(stressSignal, data, s, addr)
        if status == True:
            print('got a stress call!')
            os.system('aplay help1.wav &')
            stressState = True


s.close()
