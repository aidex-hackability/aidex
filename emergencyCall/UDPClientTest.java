import java.io.*;
import java.net.*;

class UDPClient {
    int PORT = 9876;
    String HOST = "localhost";

    byte[] receiveData = new byte[1024];

    DatagramSocket clientSocket;
    InetAddress IPAddress;

    DatagramPacket sendPacket;
    DatagramPacket receivePacket;

    public UDPClient() throws Exception {
        clientSocket = new DatagramSocket();
        IPAddress = InetAddress.getByName(HOST);
    }
    public void send(byte[] sendData) throws Exception {
        sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, PORT);
        clientSocket.send(sendPacket);
    }
    public String recv() throws Exception {
        receivePacket = new DatagramPacket(receiveData, receiveData.length);
        clientSocket.receive(receivePacket);
        return new String(receivePacket.getData());
    }
    public void close()
    {
        clientSocket.close();
    }

}


class UDPClientTest {
    public static void main(String args[]) throws Exception {
        UDPClient sock = new UDPClient();

        BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in));
        System.out.print("input >> ");
        String sentence = inFromUser.readLine();
        
        sock.send(sentence.getBytes());
        System.out.print("sock send! \n");

        System.out.print("sock recv! \n");
        String modifiedSentence = sock.recv(); //new String(receivePacket.getData());
        System.out.print("sock recv [done]! \n");

        byte[] arr =  modifiedSentence.getBytes();
        System.out.print("output >> ");
        System.out.printf("0x%02X\n", arr[0]);

        sock.close();
    }
}