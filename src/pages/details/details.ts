import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
// import * as $ from "jquery";
import { Content } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
const MY_SERVICE = 'd3dd86a5-d1fc-4227-aa8d-610b6371f442';
const MY_CHARACTERISTIC = 'aa4bd7c3-2906-4b7f-82a9-1cad53a49775';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})



export class DetailsPage {
  pcbshidu: any;
  pcbdec: any;

  controlV: any;
  controlmA: any;

  fieldV: any;
  fieldmA: any;

  encoders1: any;
  encoders2: any;

  strain1: any;
  strain2: any;
  strain1isV: any;
  strain2isV: any;
  temp1 = "";
  temp2 = "";
  retuValue: any = "";

  //volves 15

  volAhavebac: any[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];//为 true  false的数组
  volBhavebac: any[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  t1: any[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  t2: any[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  //volvesPercent
  volvesPercentArry: any[] = ['0.00%', '0.00%', '0.00%', '0.00%', '0.00%', '0.00%', '0.00%',
    '0.00%', '0.00%', '0.00%', '0.00%', '0.00%', '0.00%', '0.00%', '0.00%',]; //数组。存的是类似'0%' 这样的字符串。['0.01%','50%','0%']
  volvesmAArray: any[] = [];//数组

  //sensors  15
  fault: any[] = [];//数组
  powerbac: any[] = [];//数组
  power: any[] = [];//数组

  rawvalue: any[] = [];//数组
  config: any[] = ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'];//数组
  myconfig: any[] = ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'];
  flagEndA: any;
  flagEndB: any;
  countCompu: any = 0;
  compareValue: any = '没有任何操作';
  comein: any;;
  mydata: number;
  public tabs: string = 'general';
  text1: any;
  text2: any;
  signal: any;
  isCons: any = 'NONE';
  // connected: any;
  scrollAmount: any;
  direction: any;
  Values: any[] = [];
  Values2: any[] = [];
  device: any;
  periphersinfos: any;//设备信息数据
  iscon: any = true;//判断连接的设备是否中断
  timevalue: any;
  timevalue1: any;

  ValuesString: any;
  Values2String: any;
  flaged: any = false;//控制断开后的每隔10秒的提示，只提示一次。若再次连接后，又每隔10秒一直检测
  //为true 表示已断开 谈了一次框 不要再弹框
  toastcount: any = 1;
  devicesconsole: any[] = [];
  readdataconsole: any;
  readdataconsole1: any;
  readdataconsole2: any;//200字节中去掉了头尾
  readdataconsole22: any;//200

  addre: any = "";
  instru: any = "";

  search: any = true;//底部区域默认是隐藏的
  conStatus: any = "";
  readdataconsole3: any;//128字节去掉了头尾
  readdataconsole33: any;//128
  readdataconsole4: any;//328字节去掉了头尾
  readdataconsole5: any;//328字节去掉了头尾

  mvpeNameall: any = "";
  allMvpeName: any = "";
  readdataconsole44: any;//328
  readdataconsole4arry: any[] = [];
  //和校验
  consolesum: any;
  consolevalidatedec10: any;
  consolesum1: any;
  consolevalidatedec101: any;
  sentcount: any = 0;//蓝牙发射的帧数，一条数据被分为两帧来发送
  peripheral: any = {};//某个已连接的设备
  peripheralconsole: any;
  BhasExe: boolean = false;
  countOneTwo: number = 0;
  isTrueA: any = false;
  isTrueB: any = false;
  countCompuelse: any = 0;
  firstRe: any[] = ['0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000',
    '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000',
    '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000',
    '0000000000000000'];
  secRe: any[] = ['0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000',
    '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000',
    '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000',
    '0000000000000000'];
  concatarr: any[] = [];
  Bbaccount: number = 0;
  test = 0;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public ngZone: NgZone, public alertCtrl: AlertController,
    public toastCtrl: ToastController, private ble: BLE, public loadingCtrl: LoadingController) {

    this.Values = [
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': true, 't6': false },
      { 't1': 'A', 't2': '100%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '100%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },];

    this.Values2 = [
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'Ok', 't2': 'OFF', 't3': '0.00', 't4': 'V' },
      { 't1': 'Ok', 't2': 'OFF', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '0.00', 't4': 'V' }];

    this.device = this.navParams.get('device');
    this.periphersinfos = this.navParams.get('periphers');
    this.text1 = this.device.name;
    this.text2 = this.navParams.get('fromhome');;//mvpe name值
    this.signal = this.device.rssi;
  }

  //读取mvpe的name
  senRequestMVPEname() {
    var data = new Uint8Array(6);
    data[0] = 0xAA;

    data[1] = 0;
    data[2] = 1;
    data[3] = 0x33;
    var Checksum = 1 + 51;
    data[4] = Checksum;
    data[5] = 0xBB;

    this.ble.write(this.device.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      this.presentLoading("MVPE name获取指令发送成功", 1500);
      // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      //   data => this.onDataChangeMVPEName(data), () => { }
      // )
    }, e => {
      this.presentAlertTestMvpeName();
    });
  }

  backarrow() {
    //断开连接
    this.ble.disconnect(this.device.id).then(
      () => { this.sentcount = 0; },
      () => { }
    )

    this.navCtrl.pop();
  }

  breakCon() {
    //关闭数据请求
    this.senRequest1();

    //首先判断是否连接
    this.ble.isConnected(this.device.id).then(
      () => {
        this.iscon = true;
      },
      () => {
        this.iscon = false;
      });

    if (this.iscon == true) {//已连接  就断开 取消监听
      this.ble.stopNotification(this.device.id, MY_SERVICE, MY_CHARACTERISTIC).then(
        () => { this.sentcount = 0; }, () => { });
      this.ble.disconnect(this.device.id).then(
        () => {
          this.sentcount = 0;
          this.isCons = 'Disconnected';
          this.signal = 'NONE'
          this.presentLoading("Disconnect success", 1500);
          this.sentcount = 0;
        },
        () => { this.presentLoading("Disconnect failed", 1500); }
      );
    }
  }

  reconnect() {
    setTimeout(() => {
      this.ble.connect(this.device.id).subscribe(
        peripheral => {
          this.sentcount = 0;
          this.onConnected(peripheral);
          this.isCons = 'Connected';
          this.signal = (peripheral.rssi > (-70)) ? 'STRONG' : 'WEAK';
          this.presentLoading("Success", 2000);
          this.flaged = false;
        },
        peripheral => {
          this.presentLoading("Time out", 1000);
          this.isCons = 'Disconnected';
          this.signal = 'NONE';
          this.flaged = true;
        }
      );
    }, 1000);

  }
  onConnected(peripheral) {

    this.peripheralconsole = JSON.stringify(peripheral);

    this.senRequest();//发指令

    this.ble.startNotification(peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).subscribe(
      data => {
        this.onDataChange(data);
        this.sentcount++;
      }, () => { }
    );

  }
  //发送请求数据指令
  senRequest() {
    var data = new Uint8Array(9);
    data[0] = 0xAA;

    data[1] = 0;
    data[2] = 4;
    data[3] = 0x10;
    data[4] = 100;
    data[5] = 0x0;
    data[6] = 0x12;

    var Checksum = 4 + 16 + 100 + 18;

    data[7] = Checksum;
    data[8] = 0xBB;

    this.ble.write(this.device.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      this.presentLoading("获取数据指令发送成功", 1500);

    }, e => {
      this.presentAlertTest1();
    });
  }

  //关闭数据监视指令
  senRequest1() {
    var data = new Uint8Array(9);
    data[0] = 0xAA;

    data[1] = 0;
    data[2] = 4;
    data[3] = 0x11;
    data[4] = 100;
    data[5] = 0x0;
    data[6] = 0x12;

    var Checksum = 4 + 17 + 100 + 18;

    data[7] = Checksum;
    data[8] = 0xBB;

    this.ble.write(this.device.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      // this.presentLoading("关闭数据监视指令发送成功", 1500);

    }, e => {
      this.presentAlertTest2();
    });
  }


  //滑动按钮来修改MVPE的name
  swipeEvent($event) {
    this.presentPrompt();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Modify name',
      message: 'Do you want to modify the name of MVPE?',
      mode: 'ios',
      inputs: [
        {
          name: 'name',
          placeholder: 'please enter a new name'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(typeof (data.name));
            let dataIsOk = this.reTest(data.name);
            let tempdata = data.name + '';//更改的设备名

            if (dataIsOk) {
              this.ble.stopNotification(this.device.id, MY_SERVICE, MY_CHARACTERISTIC).then(
                () => { }, () => { });
              this.allMvpeName = tempdata;
              this.senRequestChangeMVPEName(tempdata);
            }
          }
        }
      ]
    });
    alert.present();
  }


  //修改设备MVPE名字
  senRequestChangeMVPEName(peripheralName: any) {
    var lenArr = peripheralName.length + 6;
    var data = new Uint8Array(lenArr);
    data[0] = 0xAA;
    data[1] = 0;
    data[2] = 2;
    data[3] = 0x32;

    var nameSum = 0;
    for (var i = 0; i < peripheralName.length; ++i) {//////////////////////////!!!!!!!
      data[i + 4] = peripheralName.charCodeAt(i);
      nameSum += peripheralName.charCodeAt(i);
    }
    var Checksum = 2 + 50 + nameSum;
    if (Checksum > 255) {
      Checksum = 255;
    }
    data[lenArr - 2] = Checksum;
    data[lenArr - 1] = 0xBB;
    this.ble.write(this.device.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      //   data => this.onDataChangeName(data), () => { }
      // )
      this.presentLoading("修改MVPEname数据指令发送成功", 2500);

      // 返回到上一页
      setTimeout(() => {
        this.navCtrl.pop();
      }, 1000);

    }, e => {
      this.presentAlertTest3();
    });
  }

  onDataChangeName(buffer: ArrayBuffer) {//修改mvpe name
    var data = new Uint8Array(buffer);
    this.presentLoading("修改MVPEname的返回码：" + data[3], 6000);
  }
  onDataChangeMVPEName(buffer: ArrayBuffer) {//读取mvpe name
    var data = new Uint8Array(buffer);
    var mvpeName = "";
    for (var i = 4; i < data.length - 2; i++) {
      //ascii转为字符
      mvpeName += String.fromCharCode(data[i]);
    }
    this.mvpeNameall = mvpeName;
    this.presentLoading("读取MVPEname：" + data, 6000);
  }

  onDataChangeStatus(buffer: ArrayBuffer) {//读取连接状态
    var data = new Uint8Array(buffer);
    if (data[4] == 1) {
      this.conStatus = "Connected";
    }
    else if (data[4] == 0) {
      this.conStatus = "DisConnected";
    } else {
      this.conStatus = "Unknown";
    }
  }

  onDataChangeSet(buffer: ArrayBuffer) {//读取设置参数的状态
    var data = new Uint8Array(buffer);
    this.ngZone.run(() => {
      var str = data + '';
      var strs = new Array();
      strs = str.split(',');

      if (strs[4] == 1) {
        this.presentLoading("Value modified successfully", 2500);
      }
      else if (strs[4] == 0) {
        this.presentLoading("Value modification failed", 2500);

      } else {
        this.presentLoading("Unknown error", 1500);

      }
    });
  }

  reTest(mystr) {
    var revalue = /^\w{1,19}$/;
    var revalue2 = /^[^\s]*$/;
    if (revalue.test(mystr) && revalue2.test(mystr)) {
      return true;
    }
    this.presentAlert();
    return false;
  }

  reTestInput(mystr) {
    var revalue = /(0x)?[0-9a-f]+/i;
    if (revalue.test(mystr)) {
      return true;
    }
    this.presentAlert11();
    return false;
  }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Input data type is incorrect!',
      message: 'Please enter a combination of numbers or letters or underline,and no spaces',
      buttons: ['Ok'],
      mode: 'ios'
    });
    alert.present();
  }

  presentAlert11() {
    let alert = this.alertCtrl.create({
      title: 'Input data type is incorrect!',
      message: 'Please enter hexadecimal or decimal number',
      buttons: ['Ok'],
      mode: 'ios'
    });
    alert.present();
  }
  presentAlertTest1() {
    let alert = this.alertCtrl.create({
      title: 'Request data instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }
  presentAlertTest2() {
    let alert = this.alertCtrl.create({
      title: 'close data instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }
  presentAlertTestStatus() {
    let alert = this.alertCtrl.create({
      title: 'Connection status instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }

  presentAlertTestMvpeName() {
    let alert = this.alertCtrl.create({
      title: 'Get MVPE name instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }
  presentAlertTest3() {
    let alert = this.alertCtrl.create({
      title: 'change MVPE-name instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }
  presentAlertTest4() {
    let alert = this.alertCtrl.create({
      title: 'Value modification instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }
  presentLoading(contents: any, time: any) {
    const loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: contents,
      duration: time,
    });
    loader.present();
  }
  presentToast(mes, second, address) {
    let toast = this.toastCtrl.create({
      message: mes,
      duration: second,
      position: address,

    });

    toast.present();
  }

  isCon() {
    this.ble.isConnected(this.device.id).then(
      () => {
        this.iscon = true;
      },
      () => {
        this.iscon = false;
      });

    if (this.iscon == false) {
      this.sentcount = 0;
      this.isCons = 'Disconnected';
      this.signal = 'NONE';
      this.ble.stopNotification(this.device.id, MY_SERVICE, MY_CHARACTERISTIC).then(
        () => { this.sentcount = 0; }, () => { });
      if (this.flaged == false) {
        this.gotocon();
      }
    }
  }

  gotocon() {
    const confirm = this.alertCtrl.create({
      title: 'Reconnect',
      message: "Bluetooth is disconnected,please reconnect!",
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.flaged = true;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.reconnect();
          }
        }
      ]
    });
    confirm.present().then(() => { this.flaged = true; }, () => { this.flaged = true; });
    this.flaged = true;

  }
  sendInstru() {
    var addbool = this.reTestInput(this.addre);
    var instrubool = this.reTestInput(this.instru);

    if (addbool && instrubool) {
      var data = new Uint8Array(10);//每个元素占1个字节
      data[0] = 0xAA;
      data[1] = 0;
      data[2] = 5;//5个字节
      data[3] = 0x20;

      //拆分成两个
      var addrenum = Number(this.addre).toString(2);//统一转成十进制再转成2进制字符串
      var strAddre16 = "";
      strAddre16 = this.isBinaryof16bit(addrenum);//16位的二进制
      var before8 = "";//16位前8位
      var after8 = "";//16位后8位
      for (let index = 0; index < strAddre16.length; index++) {
        if (index < 8) {
          before8 += strAddre16.charAt(index);
        } else {
          after8 += strAddre16.charAt(index);
        }
      }
      data[4] = parseInt(before8, 2);
      data[5] = parseInt(after8, 2);


      //拆分成两个
      var instrunum = Number(this.instru).toString(2);//统一转成十进制再转成2进制字符串
      var strAddre16s = "";
      strAddre16s = this.isBinaryof16bit(instrunum);//16位的二进制
      var before8s = "";//16位前8位
      var after8s = "";//16位后8位
      for (let index = 0; index < strAddre16s.length; index++) {
        if (index < 8) {
          before8s += strAddre16s.charAt(index);
        } else {
          after8s += strAddre16s.charAt(index);
        }
      }
      data[6] = parseInt(before8s, 2);
      data[7] = parseInt(after8s, 2);


      var checkSum = 5 + 32 + Number(this.addre) + Number(this.instru);
      if (checkSum > 255) {
        checkSum = 255;
      }
      data[8] = checkSum;
      data[9] = 0xBB;

      this.ble.write(this.device.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
        // this.presentLoading("设置参数指令发送成功", 1500);
        //先发指令取消数据监听
        // this.senRequest1();
        //再startnotify监听反馈值 不用下面的read
        // this.ble.startNotification(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).subscribe(
        //   data => {
        //     data => this.onDataChangeSet(data);
        //   }, () => { }
        // );
        // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(data => {
        //   data => this.onDataChangeSet(data);
        // }, () => { });
      }, e => {
        this.presentAlertTest4();
      });

    }

  }

  ionViewWillEnter() {

    //断开连接再连接上
    // this.ble.disconnect(this.device.id).then(
    //   () => { this.sentcount = 0; },
    //   () => { }
    // );
    setTimeout(() => {
      // this.senRequestMVPEname();

      this.ble.connect(this.device.id).subscribe(
        peripheral => {
          var cha = peripheral.characteristics;
          this.sentcount = 0;
          this.onConnected(peripheral);
          this.isCons = 'Connected';
          this.signal = (peripheral.rssi > (-70)) ? 'STRONG' : 'WEAK';
          // this.presentLoading("Success", 1000);
          this.flaged = false;
        },
        peripheral => {
          this.presentLoading("Time out", 2000);
          this.flaged = false;
          this.isCons = 'Disconnected';
          this.signal = 'NONE';
        }
      );
    }, 10);


  }

  //设置是否弹出底部区域
  setpage() {
    this.search = !this.search;
    if (!this.search) {
      //获取连接状态
      this.senRequestStatus();
      //弹出底部空间
      setTimeout(() => {
        this.content.scrollToBottom(500);
      }, 100);
    }
  }

  //读取两个板子连接状态
  senRequestStatus() {
    var data = new Uint8Array(6);
    data[0] = 0xAA;

    data[1] = 0;
    data[2] = 1;
    data[3] = 0x41;//////是否有问题
    var Checksum = 66;
    data[4] = Checksum;
    data[5] = 0xBB;

    this.ble.write(this.device.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      this.presentLoading("状态获取指令发送成功", 1500);
      // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      //   data => this.onDataChangeStatus(data), () => { }
      // )
    }, e => {
      this.presentAlertTestStatus();

    });
  }

  ionViewDidEnter() {
    this.timevalue1 = setInterval(() => {
      if (this.readdataconsole4arry.length > 310) {
        this.reso(this.readdataconsole4arry);
      }
    }, 600);
    this.timevalue = setInterval(() => { this.isCon() }, 7000);//每隔10秒钟检查下设备是否断开连接
  }


  onDataChange(buffer: ArrayBuffer) {
    //sentcount为偶数，表示一整条数据的发送开始即163字节的那帧开始发。为奇数，表示148字节的那帧数据在发
    // if (this.sentcount % 2 == 0) {
    //163字节开始发
    var data = new Uint8Array(buffer);
    this.ngZone.run(() => {
      var str = data + '';
      var strs = new Array();
      var strs1 = new Array();
      var strs11 = new Array();
      strs = str.split(',');
      //获取连接状态
      if (strs[3] == 129) {
        if (strs[4] == 1) {//连接着
          this.conStatus = "Connected";
        } else if (strs[4] == 0) {
          this.conStatus = "DisConnected";
        } else {
          this.conStatus = "Unknown";
        }
      }

      //获取mvpename
      if (strs[3] == 115) {
        var mvpeName = "";
        for (var i = 4; i < strs.length - 2; i++) {
          //ascii转为字符
          mvpeName += String.fromCharCode(strs[i]);
        }
        this.mvpeNameall = mvpeName;
      }

      //修改参数指令的返回值
      if (strs[3] == 96) {
        if (strs[4] == 1) {
          this.retuValue = "Value modified successfully!";
        } else if (strs[4] == 0) {
          this.retuValue = "Value modification failed!";
        } else {
          this.retuValue = "Unknown error!";
        }
      }

      //修改mvpename

      // 把名字存在本地  若返回的数据的成功 则把本地的名字直接设置到mvpename

      if (strs[3] == 114) {
        if (strs[4] == 1) {
          this.mvpeNameall = this.allMvpeName;
        }
      }

      if (strs[4] == 0) {//为第一帧
        var j = 0;
        for (var i = 0; i < strs.length - 2; i++) {//去掉后2个字节
          strs1[j] = strs[i];
          j++;
        }
        var strs2 = strs1.toString();
        this.readdataconsole22 = strs;//数组 完整数据
        this.readdataconsole2 = strs2;               ////163字节数据

      } else if (strs[4] == 1) {//为第二帧
        this.readdataconsole33 = strs;
        var j1 = 0;
        for (var i1 = 5; i1 < strs.length - 4; i1++) {//去掉前5字节与后4个字节 148
          strs11[j1] = strs[i1];
          j1++;
        }
        var strs21 = strs11.toString();
        this.readdataconsole3 = strs21;

        this.readdataconsole4 = this.readdataconsole2 + ',' + this.readdataconsole3;//去掉后的拼接
        //把拼接的数据转换为数组形式，便于数据解析
        var ss = this.readdataconsole4;
        var strsss = new Array();
        strsss = ss.split(',');
        this.readdataconsole4arry = strsss;//去掉的数组形式
      }
    });
  }
  // else {//160字节开始发
  //   let data1 = new Uint8Array(buffer);
  //   this.ngZone.run(() => {
  //     var str1 = data1 + '';
  //     var strs1 = new Array(); //定义一数组 
  //     var strs11 = new Array();

  //     strs1 = str1.split(",");
  //     this.readdataconsole33 = strs1;//数组 完整数据

  //     var j1 = 0;
  //     for (var i1 = 5; i1 < this.readdataconsole33.length - 4; i1++) {//去掉前5字节与后4个字节 148
  //       strs11[j1] = this.readdataconsole33[i1];
  //       j1++;
  //     }
  //     var strs21 = strs11.toString();
  //     this.readdataconsole3 = strs21;

  //     this.readdataconsole4 = this.readdataconsole2 + ',' + this.readdataconsole3;//去掉后的拼接
  //     this.readdataconsole44 = this.readdataconsole22 + '---' + this.readdataconsole33;

  //     //把拼接的数据转换为数组形式，便于数据解析
  //     var ss = this.readdataconsole4;
  //     var strsss = new Array();
  //     strsss = ss.split(',');
  //     this.readdataconsole4arry = strsss;//去掉的数组形式
  //     // if (this.sentcount == 1) {//首次展示数据时，获取一次数据 作为对比的最初值
  //     //   var arr = new Array();
  //     //   for (let i = 30, j = 0; i < 60; i++ , i++ , j++) {
  //     //     var str1 = parseInt(strsss[i + 1]).toString(2);
  //     //     var str2 = parseInt(strsss[i]).toString(2);
  //     //     str1 = this.isBinaryof8bit(str1);
  //     //     str2 = this.isBinaryof8bit(str2);
  //     //     arr[j] = str1 + str2;//存着2进制的数组
  //     //   }
  //     //   this.firstRe = [...arr];
  //     // }

  //   });

  // }

  // }


  reso(str: any) {

    //general
    this.pcb(str);
    this.controlmethod(str);
    this.fieldmethod(str);
    this.encodersmethod(str);
    this.strain1method(str);
    this.strain2method(str);
    this.tempraturemethod(str);


    //volves
    this.volvesPercent(str);
    this.volvesmAmethod(str);

    //sensors
    this.configmethod(str);
    this.faultmethod(str);
    this.powermethod(str);
    this.rawValuemethod(str);


    for (let index = 0; index < 15; index++) {//t5-A,t6-B
      this.Values[index].t5 = this.volAhavebac[index];
      this.Values[index].t6 = this.volBhavebac[index];
      this.Values[index].t2 = this.volvesPercentArry[index];
      this.Values[index].t4 = this.volvesmAArray[index];
    }

    for (let index = 0; index < 15; index++) {
      this.Values2[index].t1 = this.fault[index];
      this.Values2[index].t2 = this.power[index];
      this.Values2[index].t3 = this.rawvalue[index];
      this.Values2[index].t4 = this.myconfig[index];
    }

    this.ValuesString = JSON.stringify(this.Values);
    this.Values2String = JSON.stringify(this.Values2);
  }


  pcb(str: any) {
    this.pcbshidu = str[113];
    this.pcbdec = (str[114] / 1).toFixed(2);
  }

  controlmethod(str: any) {
    this.controlV = (str[115] / 5).toFixed(2);
    this.controlmA = (str[117] / 5).toFixed(2);
  }


  fieldmethod(str: any) {
    this.fieldV = (str[116] / 5).toFixed(2);
    this.fieldmA = (str[118] / 5).toFixed(2);
  }

  encodersmethod(str: any) {
    //encoder1
    var en95 = parseInt(str[94]).toString(2);
    var en94 = parseInt(str[93]).toString(2);
    var en97 = parseInt(str[96]).toString(2);
    var en96 = parseInt(str[95]).toString(2);

    en94 = this.isBinaryof8bit(en94);
    en97 = this.isBinaryof8bit(en97);
    en96 = this.isBinaryof8bit(en96);

    var sumbinary = en95 + en94 + en97 + en96;
    var sum10 = parseInt(sumbinary, 2);
    if (sum10 == 4294967295) {
      sum10 = -2147483647;
    }
    if (sum10 > 2147483647) {  //-1 -2 -3  ... -2147483647
      sum10 = 2147483647 - sum10;
    }
    this.encoders1 = sum10;
    //encodes2
    var en99 = parseInt(str[98]).toString(2);
    var en98 = parseInt(str[97]).toString(2);
    var en101 = parseInt(str[100]).toString(2);
    var en100 = parseInt(str[99]).toString(2);

    en98 = this.isBinaryof8bit(en98);
    en101 = this.isBinaryof8bit(en101);
    en100 = this.isBinaryof8bit(en100);

    var sumbinary1 = en99 + en98 + en101 + en100;
    var sum101 = parseInt(sumbinary1, 2);
    if (sum101 == 4294967295) {
      sum101 = -2147483647;
    }
    if (sum101 > 2147483647) {  //-1 -2 -3  ... -2147483647
      sum101 = 2147483647 - sum101
    }
    this.encoders2 = sum101;

  }



  //strain1
  strain1method(str: any) {
    var starin103 = parseInt(str[102]).toString(2);
    var starin102 = parseInt(str[101]).toString(2);
    starin102 = this.isBinaryof8bit(starin102);
    starin103 = this.isBinaryof8bit(starin103);////////
    var sumbinary = starin103 + starin102;
    if (sumbinary[0] == '0') {
      var sum10 = parseInt(sumbinary, 2);
      var per = (5 * sum10) / 32276;
      this.strain1 = per.toFixed(2);
    }
    if (sumbinary[0] == '1') {//减一取反
      var sumbinary1 = parseInt(sumbinary, 2) - 1;
      var yuan = sumbinary1.toString(2);
      var yuan1 = '';
      for (let index = 0; index < yuan.length; index++) {
        if (yuan[index] == '1') {
          yuan1 += '0';
        } else {
          yuan1 += '1';
        }
      }
      var shi = parseInt(yuan1, 2);
      var per1 = (5 * shi) / 32276;
      this.strain1 = '-' + per1.toFixed(2);
    }
  }

  //strain2
  strain2method(str: any) {
    var starin105 = parseInt(str[104]).toString(2);
    var starin104 = parseInt(str[103]).toString(2);
    starin104 = this.isBinaryof8bit(starin104);
    starin105 = this.isBinaryof8bit(starin105);
    var sumbinary1 = starin105 + starin104;
    if (sumbinary1[0] == '0') {
      var sum10 = parseInt(sumbinary1, 2);
      var per = (5 * sum10) / 32276;
      this.strain2 = per.toFixed(2);
    }

    if (sumbinary1[0] == '1') {
      var sumbinary11 = parseInt(sumbinary1, 2) - 1;
      var yuan = sumbinary11.toString(2);
      var yuan1 = '';
      for (let index = 0; index < yuan.length; index++) {
        if (yuan[index] == '1') {
          yuan1 += '0';
        } else {
          yuan1 += '1';
        }
      }
      var shi = parseInt(yuan1, 2);
      var per1 = (5 * shi) / 32276;
      this.strain2 = '-' + per1.toFixed(2);
    }

  }


  tempraturemethod(str: any) {
    //temp1
    var temp111 = parseInt(str[110]).toString(2);
    var temp110 = parseInt(str[109]).toString(2);
    temp110 = this.isBinaryof8bit(temp110);
    var sumbinary = temp111 + temp110;
    var sum10 = parseInt(sumbinary, 2);
    if (sum10 > 32767 || sum10 < 0) {
      this.temp1 = "0.00";
    } else {
      let x1 = (sum10 / 10).toFixed(2);
      if (x1 == "999.00") {
        this.temp1 = "--";
      } else {
        this.temp1 = (sum10 / 10).toFixed(2);
      }

    }
    //temp2
    var temp113 = parseInt(str[112]).toString(2);
    var temp112 = parseInt(str[111]).toString(2);
    temp112 = this.isBinaryof8bit(temp112);
    var sumbinary1 = temp113 + temp112;
    var sum101 = parseInt(sumbinary1, 2);
    if (sum101 > 32767 || sum101 < 0) {
      this.temp2 = "0.00";
    } else {
      let x2 = (sum101 / 10).toFixed(2);
      if (x2 == "999.00") {
        this.temp2 = "--";
      } else {
        this.temp2 = (sum101 / 10).toFixed(2);
      }
    }
  }



  volvesA(str: any) {////////////////////////////////////////////////////////////////////////////

    // this.secRe.push(str[24]);
    // this.secRe.push(str[25]);
    // this.secRe.push(str[26]);
    // this.secRe.push(str[27]);

    // this.concatarr = this.firstRe.concat(this.secRe);
    var f1 = parseInt(str[23]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[24]).toString(2);
    f2 = this.isBinaryof8bit(f2);
    var f2temp = f2.split('').reverse();
    f2temp.pop();
    var sum = f1temp + ',' + f2temp;
    var str15Arr = sum.split(',');
    for (var i = 0; i < str15Arr.length; i++) {
      if (str15Arr[i] == '0') {
        this.volAhavebac[i] = false;
      } else {
        this.volAhavebac[i] = true;
      }
    }
    // if ((this.firstRe.toString() != [0, 0, 0, 0].toString())) {
    //   this.flagEndA = true;

    // }

    // if ((this.firstRe.toString() != this.secRe.toString())) {
    //   this.flagEndA = true;
    //   this.firstRe = [];
    //   this.firstRe = this.secRe;

    // }
    // else {
    //   this.flagEndA = false;

    // }

    //为true时，执行百分比函数，再次进入A B 函数时，flagEndA B会一直为true
    // 0=0(啥都不点击)   0 != 2(open A)  2  = 2(再进百分比函数)  2 !=0

    this.concatarr = [];
  }

  //volvesB
  volvesB(str: any) {
    // this.secRe.push(str[24]);
    // this.secRe.push(str[25]);
    // this.secRe.push(str[26]);
    // this.secRe.push(str[27]);
    // var t2 = this.volBhavebac;
    var f1 = parseInt(str[25]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[26]).toString(2);
    f2 = this.isBinaryof8bit(f2);
    var f2temp = f2.split('').reverse();
    f2temp.pop();
    var sum = f1temp + ',' + f2temp;
    var str15Arr = sum.split(',');
    for (var i = 0; i < str15Arr.length; i++) {
      if (str15Arr[i] == '0') {
        this.volBhavebac[i] = false;
      } else {
        this.volBhavebac[i] = true;
      }
    }

    // if (this.Bbaccount == 0) {//首次
    //   if ((this.firstRe.toString() != [0, 0, 0, 0].toString())) {
    //     this.flagEndB = true;
    //   }
    // }

    // if ((this.firstRe.toString() != this.secRe.toString())) {
    //   this.flagEndB = true;
    //   this.firstRe = [];
    //   this.firstRe = this.secRe;
    // }
    // } else {
    //   this.flagEndB = false;

    // }
    this.Bbaccount++;
  }

  volvesAB(str: any) {

    var f1 = parseInt(str[23]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[24]).toString(2);
    f2 = this.isBinaryof8bit(f2);
    var f2temp = f2.split('').reverse();
    f2temp.pop();
    var sum = f1temp + ',' + f2temp;
    var str15Arr = sum.split(',');
    for (var i = 0; i < str15Arr.length; i++) {
      if (str15Arr[i] == '0') {
        this.volAhavebac[i] = false;
      } else {
        this.volAhavebac[i] = true;
      }
    }



    var f3 = parseInt(str[25]).toString(2);
    f3 = this.isBinaryof8bit(f3);
    var f3temp = f3.split('').reverse();
    var f4 = parseInt(str[26]).toString(2);
    f4 = this.isBinaryof8bit(f4);
    var f4temp = f4.split('').reverse();
    f4temp.pop();
    var sum = f3temp + ',' + f4temp;
    var str151Arr = sum.split(',');
    for (var i = 0; i < str151Arr.length; i++) {
      if (str151Arr[i] == '0') {
        this.volBhavebac[i] = false;
      } else {
        this.volBhavebac[i] = true;
      }
    }

    // this.secRe.push(str[24]);
    // this.secRe.push(str[25]);
    // this.secRe.push(str[26]);
    // this.secRe.push(str[27]);

    // var aaa = this.firstRe;
    // var bbb = this.secRe;
    // this.concatarr = [];
    // this.concatarr = aaa.concat(bbb);

    // if (this.Bbaccount == 0) {//首次
    //   if ((this.firstRe.toString() != [0, 0, 0, 0].toString())) {
    //     this.flagEndB = true;
    //     this.Bbaccount++;
    //     return;
    //   }
    // }

    // if( this.firstRe == this.secRe ){
    //   this.test = 1;
    // }

    // if ((this.firstRe.toString() != this.secRe.toString())) {
    //   this.countCompu++;
    //   this.flagEndB = true;
    //   this.firstRe = [];
    //   this.firstRe = [...this.secRe];
    //   this.compareValue = '进入if中，计算百分比';//表示前后比较不一样
    // } else {
    //   this.compareValue = '进入else中，不计算';
    //   this.countCompuelse++;
    // }

    this.Bbaccount++;

  }


  volvesPercent(str: any) {
    if (this.countOneTwo == 0) {
      this.firstCome(str);
      this.countOneTwo++;
    }
    // this.volvesAB(str);

    var arr = new Array();
    var arr1 = new Array();
    for (let i = 29, j = 0; i < 59; i++ , i++ , j++) {
      var str1 = parseInt(str[i + 1]).toString(2);
      var str2 = parseInt(str[i]).toString(2);
      str1 = this.isBinaryof8bit(str1);
      str2 = this.isBinaryof8bit(str2);
      arr[j] = str1 + str2;//存着2进制的数组
    }

    this.secRe = [...arr];//最新的值
    //比较两次的值
    var recordChange = [];
    if (this.firstRe.toString() != this.secRe.toString()) { //不等则计算，如何算，根据值得正负来判定是a或 b
      for (let index = 0; index < this.firstRe.length; index++) {//哪些变化了 记录下来
        if (this.firstRe[index] != this.secRe[index]) {
          recordChange.push(index);
        }
      }

      //判断是a还是b
      var erValue = this.secRe[recordChange[0]] + '';//2进制值
      var erArr = erValue.split('');
      var firVa = erArr[0];//1或0

      if (firVa == '1') {//B的状态位发生了改变
        var myarray = erValue.split('');
        for (let index = 0; index < myarray.length; index++) {
          if (myarray[index] == '0') {
            myarray[index] = '1';
          } else {
            myarray[index] = '0';
          }
        }
        var b = '';
        for (var i = 0; i < myarray.length; i++) {
          b += myarray[i]
        }
        var oneVa = parseInt(b, 2) + 1;
        var per = ((oneVa) / 32767) * 100;

        this.volvesPercentArry[recordChange[0]] = per.toFixed(2) + "%";

        this.volAhavebac[recordChange[0]] = false;
        if (this.volvesPercentArry[recordChange[0]] == '0.00%') {
          this.volBhavebac[recordChange[0]] = false;
        } else {
          this.volBhavebac[recordChange[0]] = true;
        }
      }
      if (firVa == '0') {//A的状态位发生了改变
        var vaA = parseInt(erValue, 2);

        var per = (vaA / 32767) * 100;

        this.volvesPercentArry[recordChange[0]] = per.toFixed(2) + "%";

        this.volBhavebac[recordChange[0]] = false;
        if (this.volvesPercentArry[recordChange[0]] == '0.00%') {
          this.volAhavebac[recordChange[0]] = false;
        } else {
          this.volAhavebac[recordChange[0]] = true;
        }
      }


      this.firstRe = [...this.secRe];

    }




  }

  //首次进程序，计算AB状态是否选中。 计算百分比的值
  firstCome(str: any) {
    this.volvesAB(str);//执行一次而已 为首次服务
    var arr = new Array();
    var arr1 = new Array();
    for (let i = 29, j = 0; i < 59; i++ , i++ , j++) {
      var str1 = parseInt(str[i + 1]).toString(2);
      var str2 = parseInt(str[i]).toString(2);
      str1 = this.isBinaryof8bit(str1);
      str2 = this.isBinaryof8bit(str2);
      arr[j] = str1 + str2;//存着2进制的数组
    }
    //计算AB的状态

    // for (var x = 0; x < arr.length; x++) {
    //  var arrAB =  (arr[x]+'').split('');
    //  var isOneOrTwo = arrAB[0];
    //  if (isOneOrTwo=='1') {

    //  } 
    // }


    for (var x = 0; x < arr.length; x++) {
      arr1[x] = parseInt(arr[x], 2);
      //看此时B组打开没，打开则要把arr1中的值的2进制取反加1，再做计算
      var isTrueA = this.volAhavebac[x];
      var isTrueB = this.volBhavebac[x];

      if ((isTrueB == true) && (isTrueA == false)) {
        var myarray = (arr[x]).split('');
        for (let index = 0; index < myarray.length; index++) {
          if (myarray[index] == '0') {
            myarray[index] = '1';
          } else {
            myarray[index] = '0';
          }
        }
        var b = '';
        for (var i = 0; i < myarray.length; i++) {
          b += myarray[i]
        }
        arr1[x] = parseInt(b, 2) + 1;
        var per = ((arr1[x]) / 32767) * 100;
        this.volvesPercentArry[x] = per.toFixed(2) + "%";
      }

      if ((isTrueA == true) && (isTrueB == false)) {
        var per = ((arr1[x]) / 32767) * 100;
        this.volvesPercentArry[x] = per.toFixed(2) + "%";
      }

      if (isTrueA && isTrueB) {
        this.volvesPercentArry[x] = "0.00%";
      }
      if ((isTrueA == false) && (isTrueB == false)) {
        this.volvesPercentArry[x] = "0.00%";
      }

    }

  }




  volvesmAmethod(str: any) {//
    this.volvesmAArray[0] = str[120] * 10;//算出来值单位为mA
    this.volvesmAArray[1] = str[119] * 10;
    this.volvesmAArray[2] = str[122] * 10;
    this.volvesmAArray[3] = str[121] * 10;
    this.volvesmAArray[4] = str[124] * 10;
    this.volvesmAArray[5] = str[123] * 10;
    this.volvesmAArray[6] = str[126] * 10;
    this.volvesmAArray[7] = str[125] * 10;
    this.volvesmAArray[8] = str[128] * 10;
    this.volvesmAArray[9] = str[127] * 10;
    this.volvesmAArray[10] = str[130] * 10;
    this.volvesmAArray[11] = str[129] * 10;
    this.volvesmAArray[12] = str[132] * 10;
    this.volvesmAArray[13] = str[131] * 10;
    this.volvesmAArray[14] = str[134] * 10;

    for (let i = 0; i < this.volvesmAArray.length; i++) {
      this.volvesmAArray[i] = JSON.stringify(this.volvesmAArray[i]);
    }
    // let x0 =(parseInt(this.volvesmAArray[index])/10).toString(16);

    for (let index = 0; index < this.volvesmAArray.length; index++) {
      let x0 = (parseInt(this.volvesmAArray[index]) / 10).toString(16);
      if ((x0 == 'ff') || (x0 == 'FF')) {
        this.volvesmAArray[index] = 'Short';
      } else if (x0 == 'fe' || (x0 == 'FE')) {
        this.volvesmAArray[index] = 'Open';
      }
    }
  }

  //sensors  15
  //fault
  faultmethod(str: any) {
    var f1 = parseInt(str[135]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[136]).toString(2);
    f2 = this.isBinaryof8bit(f2);
    var f2temp = f2.split('').reverse();
    f2temp.pop();
    var sum = f1temp + ',' + f2temp;
    var sumarr = sum.split(',');
    for (let index = 0; index < sumarr.length; index++) {
      if (sumarr[index] == '0') {
        this.fault[index] = 'Ok';
      } else {
        this.fault[index] = 'F';
      }

    }
  }
  powermethod(str: any) {
    var f1 = parseInt(str[59]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[60]).toString(2);
    f2 = this.isBinaryof8bit(f2);
    var f2temp = f2.split('').reverse();
    f2temp.pop();
    var sum = f1temp + ',' + f2temp;
    var sumarr = sum.split(',');
    for (let index = 0; index < sumarr.length; index++) {
      if (sumarr[index] == '0') {//0-关闭 且没有背景色
        this.power[index] = 'Off';
        this.powerbac[index] = false;
      } else {
        this.power[index] = 'On';
        this.powerbac[index] = true;
      }
    }


  }

  rawValuemethod(str: any) {///////////要用到config
    var arr = new Array();
    for (let i = 63, j = 0; i < 93; i++ , i++ , j++) {
      var str1 = parseInt(str[i + 1]).toString(2);
      var f1 = parseInt(str[i]).toString(2);
      f1 = this.isBinaryof8bit(f1);
      var sum2 = str1 + f1;
      var sum10 = parseInt(sum2, 2);
      arr[j] = sum10;
    }

    // arr=[101,102,100,1000,1009,1000000];
    for (var x = 0; x < arr.length; x++) {
      if ((arr[x] < 32768) && (arr[x] > 0)) {
        var x2 = this.myconfig[x];
        //單位是V则*10
        if (x2 == 'V') {
          var per = ((arr[x]) / 32767) * 10;
          this.rawvalue[x] = per.toFixed(2);
        }
        //單位是mA则*20
        else {
          var per1 = ((arr[x]) / 32767) * 21.14;
          this.rawvalue[x] = per1.toFixed(2);
        }
      } else {
        this.rawvalue[x] = '0.00';
      }
    }

  }
  configmethod(str: any) {
    var f1 = parseInt(str[167]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[168]).toString(2);
    f2 = this.isBinaryof8bit(f2);
    var f2temp = f2.split('').reverse();
    f2temp.pop();
    var sum = f1temp + ',' + f2temp;
    var sumarr = sum.split(',');
    for (let index = 0; index < sumarr.length; index++) {
      if (sumarr[index] == '0') {//0-关闭 且没有背景色
        this.myconfig[index] = 'V';
      } else {
        this.myconfig[index] = 'mA';
      }
    }
    this.config = this.myconfig;
  }


  isBinaryof8bit(str: any) {
    var va = '';//8位的2进制
    if (8 - str.length != 0) {
      var y = 8 - str.length;
      for (var i = 0; i < y; i++) { va += '0'; }
      va += str;
      str = va;
    }
    return str;
  }

  isBinaryof16bit(str: any) {
    var va = '';//16位的2进制
    if (16 - str.length != 0) {
      var y = 16 - str.length;
      for (var i = 0; i < y; i++) { va += '0'; }
      va += str;
      str = va;
    }
    return str;
  }

  ionViewDidLeave() {
    clearInterval(this.timevalue);
    clearInterval(this.timevalue1);
    this.ble.stopNotification(this.device.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      () => { this.sentcount = 0; }, () => { });
    this.ble.disconnect(this.device.id).then(
      () => { this.sentcount = 0; },
      () => { }
    );
  }

  backfir() {
    this.navCtrl.pop();
  }
}
