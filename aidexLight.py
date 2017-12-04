# Example of low-level Python wrapper for rpi_ws281x library.
# Author: Tony DiCola (tony@tonydicola.com), Jeremy Garff (jer@jers.net)
#
# This is an example of how to use the SWIG-generated _rpi_ws281x module.
# You probably don't want to use this unless you are building your own library,
# because the SWIG generated module is clunky and verbose.  Instead look at the
# high level Python port of Adafruit's NeoPixel Arduino library in strandtest.py.
#
# This code will animate a number of WS281x LEDs displaying rainbow colors.
import time
import RPi.GPIO as GPIO

import _rpi_ws281x as ws


# for socket
import socket
import sys
import os

HOST = ''   # Symbolic name meaning all available interfaces
PORT = 9876  # matching the java client

# LED configuration.
LED_CHANNEL    = 1
LED_COUNT      = 8         # How many LEDs to light.
LED_FREQ_HZ    = 800000     # Frequency of the LED signal.  Should be 800khz or 400khz.
LED_DMA_NUM    = 5          # DMA channel to use, can be 0-14.
LED_GPIO       = 13         # GPIO connected to the LED signal line.  Must support PWM!
LED_BRIGHTNESS = 150        # Set to 0 for darkest and 255 for brightest
LED_INVERT     = 0          # Set to 1 to invert the LED signal, good if using NPN
							# transistor as a 3.3V->5V level converter.  Keep at 0
							# for a normal/non-inverted signal.
#LED_STRIP      = ws.WS2811_STRIP_RGB
#LED_STRIP      = ws.WS2811_STRIP_GBR
#LED_STRIP      = ws.SK6812_STRIP_RGBW
LED_STRIP      = ws.SK6812W_STRIP

GPIO.setmode(GPIO.BCM)
GPIO.setup(17,GPIO.IN) #Respkr Button

# Define colors which will be used by the example.  Each color is an unsigned
# 32-bit value where the lower 24 bits define the red, green, blue data (each
# being 8 bits long).
DOT_COLORS = [  0x00200000,   # red       0x200000
                0x00201000,   # orange    0x201000
                0x00202000,   # yellow    0x202000
                0x00002000,   # green     0x002000
                0x00002020,   # lightblue 0x002020
                0x00000020,   # blue      0x000020
                0x00100020,   # purple    0x100010
                0x20000000,   # white     0xFFFFFF
                0x00000408,   # paleblue  0x200010
                0x00004020,   # grnblu    0x200010
                0x00000204 ]  # test      0x200010


# Create a ws2811_t structure from the LED configuration.
# Note that this structure will be created on the heap so you need to be careful
# that you delete its memory by calling delete_ws2811_t when it's not needed.
leds = ws.new_ws2811_t()

# Initialize all channels to off
for channum in range(2):
    channel = ws.ws2811_channel_get(leds, channum)
    ws.ws2811_channel_t_count_set(channel, 0)
    ws.ws2811_channel_t_gpionum_set(channel, 0)
    ws.ws2811_channel_t_invert_set(channel, 0)
    ws.ws2811_channel_t_brightness_set(channel, 0)

channel = ws.ws2811_channel_get(leds, LED_CHANNEL)

ws.ws2811_channel_t_count_set(channel, LED_COUNT)
ws.ws2811_channel_t_gpionum_set(channel, LED_GPIO)
ws.ws2811_channel_t_invert_set(channel, LED_INVERT)
ws.ws2811_channel_t_brightness_set(channel, LED_BRIGHTNESS)
ws.ws2811_channel_t_strip_type_set(channel, LED_STRIP)

ws.ws2811_t_freq_set(leds, LED_FREQ_HZ)
ws.ws2811_t_dmanum_set(leds, LED_DMA_NUM)

# Initialize library with LED configuration.
resp = ws.ws2811_init(leds)
if resp != ws.WS2811_SUCCESS:
	message = ws.ws2811_get_return_t_str(resp)
	raise RuntimeError('ws2811_init failed with code {0} ({1})'.format(resp, message))

#Turn all LEDS off
for i in range(LED_COUNT):
	    ws.ws2811_led_set(channel, i, 0)
	    resp = ws.ws2811_render(leds)
	    
time.sleep(0.75)

input = GPIO.input(17)

#while not input
#    print ("waiting for button")

# Wrap following code in a try/finally to ensure cleanup functions are called
# after library is initialized.

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

print("Socket bind to port ...")

# const for replay
stressResp = 0x63    # placeholder for now
stressSignal = 0x61  # change it to 0xF2 later
stressConfirm = 0x62  # change it to 0xF4

def sendReply(sock, msg, msgFrom):
    #reply = b'OK...' + msg
    #sock.sendto(reply , msgFrom)
    print('Message[' + str(msgFrom[0]) + ':' +
          str(msgFrom[1]) + '] - ' + msg.strip().decode("utf-8"))
    #reply = b'Signal received: ' + msg
    reply = msg
    sock.sendto(reply, msgFrom)




while 1:
    print('waiting for input ...')
    d = s.recvfrom(1024)
    data = d[0]
    addr = d[1]

    sendReply(s, stressResp.to_bytes(1, byteorder='big'), addr)

    #Turn all LEDS Red
    if data[0] == 0x72:  #'r'
            for i in range(LED_COUNT):
                ws.ws2811_led_set(channel, i, DOT_COLORS[0])
                resp = ws.ws2811_render(leds)
                time.sleep(0.035)

    elif data[0] == 0x6C: #'l'
            for i in range(LED_COUNT):
                            # Pick a color based on LED position and an offset for animation.
                            color = DOT_COLORS[9]
                            print(color)
                            #time.sleep(0.02)
                            # Set the LED color buffer value.
                            #ws.ws2811_led_set(channel, 6, color)
                            ws.ws2811_led_set(channel, i, color)
                            resp = ws.ws2811_render(leds)
            time.sleep(0.005)
            for i in range(LED_COUNT-2):
                            # Pick a color based on LED position and an offset for animation.
                            color = DOT_COLORS[8]
                            print(color)
                            time.sleep(0.005)
                            # Set the LED color buffer value.
                            ws.ws2811_led_set(channel, i, color)
                            resp = ws.ws2811_render(leds)
            time.sleep(2.25)
            
    else:
            
    #	for i in range(1):
    #		# Update each LED color in the buffer.
    #		for i in range(LED_COUNT-2):
    #			# Pick a color based on LED position and an offset for animation.
    #			color = DOT_COLORS[(10 ) % len(DOT_COLORS)] # + offset
    #			print(color)
    #			time.sleep(0.05)
    #                        # Set the LED color buffer value.
    #			ws.ws2811_led_set(channel, i, color)
    #			time.sleep(0.25)
    #
    #		# Send the LED color data to the hardware.
    #		resp = ws.ws2811_render(leds)
    #		if resp != ws.WS2811_SUCCESS:
    #			message = ws.ws2811_get_return_t_str(resp)
    #			raise RuntimeError('ws2811_render failed with code {0} ({1})'.format(resp, message))
    #
    #		# Delay for a small period of time.
    #		time.sleep(0.10)
    #		print(offset)

                    # Increase offset to animate colors moving.  Will eventually overflow, which
                    # is fine.
                    #offset += 1


    #finally:
            # Ensure ws2811_fini is called before the program quits.
            #ws.ws2811_fini(leds)
            # Example of calling delete function to clean up structure memory.  Isn't
            # strictly necessary at the end of the program execution here, but is good practice.

        pass

print('deal with the segmentation fault!')
ws.ws2811_fini(leds)

print('closing sockets')
s.close()

