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
  // MY_SERVICE = 'd3dd86a5-d1fc-4227-aa8d-610b6371f442';
  // MY_CHARACTERISTIC = 'aa4bd7c3-2906-4b7f-82a9-1cad53a49775';
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

  //volves 15

  volAhavebac: any[] = [];//为 true  false的数组
  volBhavebac: any[] = [];
  //volvesPercent
  volvesPercentArry: any[] = []; //数组。存的是类似'0%' 这样的字符串。['0.01%','50%','0%']
  volvesmAArray: any[] = [];//数组

  //sensors  15
  fault: any[] = [];//数组
  powerbac: any[] = [];//数组
  power: any[] = [];//数组

  rawvalue: any[] = [];//数组
  config: any[] = [];//数组
  myconfig: any[] = [];

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


  readdataconsole3: any;//128字节去掉了头尾
  readdataconsole33: any;//128
  readdataconsole4: any;//328字节去掉了头尾
  readdataconsole5: any;//328字节去掉了头尾

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
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public ngZone: NgZone, public alertCtrl: AlertController,
    public toastCtrl: ToastController, private ble: BLE, public loadingCtrl: LoadingController) {
    this.Values = [
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '0', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '22', 't5': true, 't6': true },
      { 't1': 'A', 't2': '100%', 't3': 'B', 't4': '5.55', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '100%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },
      { 't1': 'A', 't2': '50%', 't3': 'B', 't4': '---', 't5': false, 't6': false },];

    this.Values2 = [
      { 't1': 'F', 't2': 'ON', 't3': '11-', 't4': 'ma' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'Ok', 't2': 'OFF', 't3': '---', 't4': 'V' },
      { 't1': 'Ok', 't2': 'OFF', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' },
      { 't1': 'F', 't2': 'ON', 't3': '---', 't4': 'V' }];

    this.device = this.navParams.get('device');
    this.periphersinfos = this.navParams.get('periphers');
    this.text1 = this.device.name;
    this.text2 = this.device.id;
    this.signal = this.device.rssi;

    //断开连接再连接上
    this.ble.disconnect(this.device.id).then(
      () => { this.sentcount = 0; },
      () => { }
    );

    this.ble.connect(this.device.id).subscribe(
      peripheral => {
        var cha = peripheral.characteristics;
        // this.MY_SERVICE = JSON.stringify(cha[cha.length - 1].service);
        // this.MY_CHARACTERISTIC = JSON.stringify(cha[cha.length - 1].characteristic);

        this.sentcount = 0;
        this.onConnected(peripheral);
        this.isCons = 'Connected';
        this.signal = (peripheral.rssi > (-70)) ? 'STRONG' : 'WEAK';
        // this.presentLoading("Success", 2000);
        this.flaged = false;
      },
      peripheral => {
        this.presentLoading("Time out", 2000);
        this.flaged = false;
        this.isCons = 'Disconnected';
        this.signal = 'NONE';
      }
    );




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
    //首先判断是否连接
    this.ble.isConnected(this.device.id).then(
      () => {
        this.iscon = true;
        // this.isCons = 'connected';
      },
      () => {
        // this.sentcount = 0;
        this.iscon = false;
        // this.isCons = 'disconnected';
        // this.signal = 'NONE'


        // this.gotocon();/////////

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
        this.presentLoading("Time out", 2000);
        this.isCons = 'Disconnect';
        this.signal = 'NONE';
        this.flaged = true;
      }
    );
  }

  onConnected(peripheral) {

    this.peripheralconsole = JSON.stringify(peripheral);

    this.ble.startNotification(peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).subscribe(
      data => {
        this.onDataChange(data);
        this.sentcount++;
      }, () => { }
    );
    this.ble.read(peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      data => this.onDataChange(data), () => { }
    );





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
      position: address
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

  ionViewWillEnter() {
    this.timevalue1 = setInterval(() => {
      if (this.readdataconsole4arry.length > 310) {
        this.reso(this.readdataconsole4arry);
      }
    }, 100);


  }


  ionViewDidEnter() {
    this.timevalue = setInterval(() => { this.isCon() }, 7000);//每隔10秒钟检查下设备是否断开连接
  }


  onDataChange(buffer: ArrayBuffer) {
    //sentcount为偶数，表示一整条数据的发送开始即168字节的那帧开始发。为奇数，表示160字节的那帧数据在发
    if (this.sentcount % 2 == 0) {//168字节开始发
      var data = new Uint8Array(buffer);
      // this.readdataconsole22 = data;
      var data1 = new Uint8Array(buffer) + '';
      this.ngZone.run(() => {
        var str = data + '';
        var strs = new Array();
        var strs1 = new Array();

        strs = str.split(',');
        this.readdataconsole22 = strs;//数组 完整数据
        var j = 0;
        for (var i = 0; i < strs.length - 4; i++) {//去掉后4个字节
          strs1[j] = strs[i];
          j++;
        }
        var strs2 = strs1.toString();
        this.readdataconsole2 = strs2;



        // this.readdataconsole2 = strs1;//数组

      });

    } else {//160字节开始发
      let data1 = new Uint8Array(buffer);
      this.ngZone.run(() => {
        var str1 = data1 + '';
        var strs1 = new Array(); //定义一数组 
        var strs11 = new Array();

        strs1 = str1.split(",");
        this.readdataconsole33 = strs1;//数组 完整数据

        // for (var i = 6; i < strs1.length - 6; i++) {//去掉前6字节与后6个字节
        //   strs11[j1] = strs1[i];
        //   j1++;
        // }
        // var strs21 = strs11.toString();
        // // this.readdataconsole33 = data1;
        // this.readdataconsole3 = strs21;

        // this.readdataconsole3 = strs11;//数组
        // if (this.readdataconsole22[3] == 33) {//168
          // var j = 0; var j1 = 0;
          // for (var i = 0; i < this.readdataconsole22.length - 4; i++) {//去掉后4个字节  168
          //   strs1[j] = this.readdataconsole22[i];
          //   j++;
          // }
          // var strs2 = strs1.toString();
          // this.readdataconsole2 = strs2;

          var j1 = 0;
          for (var i1 = 6; i1 < this.readdataconsole33.length - 6; i1++) {//去掉前6字节与后6个字节 160
            strs11[j1] = this.readdataconsole33[i1];
            j1++;
          }
          var strs21 = strs11.toString();
          this.readdataconsole3 = strs21;

          this.readdataconsole4 = this.readdataconsole2 + ',' + this.readdataconsole3;//去掉后的拼接
          this.readdataconsole44 = this.readdataconsole22 + '---' + this.readdataconsole33;
        // }


        // else {
        //   var j1s = 0; var js = 0;
        //   for (var i11 = 6; i11 < this.readdataconsole22.length - 6; i11++) {//去掉前6字节与后6个字节 160
        //     strs11[j1s] = this.readdataconsole22[i11];
        //     j1s++;
        //   }
        //   var strs211 = strs11.toString();
        //   this.readdataconsole2 = strs211;

        //   for (var ii = 0; ii < this.readdataconsole33.length - 4; ii++) {//去掉后4个字节  168
        //     strs1[js] = this.readdataconsole33[ii];
        //     js++;
        //   }
        //   var strs2 = strs1.toString();
        //   this.readdataconsole3 = strs2;

        //   this.readdataconsole4 = this.readdataconsole3 + ',' + this.readdataconsole2;//去掉后的拼接
        //   this.readdataconsole44 = this.readdataconsole33 + '---' + this.readdataconsole22;
        // }

        //把拼接的数据转换为数组形式，便于数据解析
        var ss = this.readdataconsole4;
        var strsss = new Array();
        strsss = ss.split(',');
        this.readdataconsole4arry = strsss;//去掉的数组形式
      });

    }

  }



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
    this.volvesA(str);
    this.volvesB(str);
    if (this.BhasExe) {
      this.volvesPercent(str);
    }
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
    this.pcbshidu = str[114];
    this.pcbdec = (str[115] / 1).toFixed(2);
  }

  controlmethod(str: any) {
    this.controlV = (str[116] / 5).toFixed(2);
    this.controlmA = (str[118] / 5).toFixed(2);
  }


  fieldmethod(str: any) {
    this.fieldV = (str[117] / 5).toFixed(2);
    this.fieldmA = (str[119] / 5).toFixed(2);
  }

  encodersmethod(str: any) {
    //encoder1
    var en95 = parseInt(str[95]).toString(2);
    var en94 = parseInt(str[94]).toString(2);
    var en97 = parseInt(str[97]).toString(2);
    var en96 = parseInt(str[96]).toString(2);

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
    var en99 = parseInt(str[99]).toString(2);
    var en98 = parseInt(str[98]).toString(2);
    var en101 = parseInt(str[101]).toString(2);
    var en100 = parseInt(str[100]).toString(2);

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
    var starin103 = parseInt(str[103]).toString(2);
    var starin102 = parseInt(str[102]).toString(2);
    starin102 = this.isBinaryof8bit(starin102);
    var sumbinary = starin103 + starin102;
    var sum10 = parseInt(sumbinary, 2);
    // if (sum10 > 32767) {
    //   sum10 = 32767 - sum10;
    var per = (5 * sum10) / 32276;
    this.strain1 = per.toFixed(2);

    // }
    // else {
    // var per1 = (5 * sum10) / 32767;
    // this.strain1 = per1.toFixed(2);
    // var havedot1 = per1.toString().split('');
    // var realDot1 = false;
    // for (let index = 0; index < havedot1.length; index++) {
    //   if (havedot1[index] == '.') {
    //     realDot1 = true;//表示是小数 不是整数。
    //   }
    // }

    // if (realDot1 == true) {//有小数点
    //   var dot1 = per1.toString().split(".")[1].length;
    //   var perstr1;
    //   if (dot1 > 3) {
    //     perstr1 = per1.toFixed(2);
    //   } else {
    //     perstr1 = per1;
    //   }
    //   this.strain1 = perstr1;
    // } else {
    //   //是整数
    //   this.strain1 = per1;
    // }
    // }


  }

  //strain2

  strain2method(str: any) {
    var starin105 = parseInt(str[105]).toString(2);
    var starin104 = parseInt(str[104]).toString(2);
    starin104 = this.isBinaryof8bit(starin104);
    var sumbinary1 = starin105 + starin104;
    var sum10 = parseInt(sumbinary1, 2);
    var per = (5 * sum10) / 32276;
    this.strain2 = per.toFixed(2);
  }


  tempraturemethod(str: any) {
    //temp1
    var temp111 = parseInt(str[111]).toString(2);
    var temp110 = parseInt(str[110]).toString(2);
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
    var temp113 = parseInt(str[113]).toString(2);
    var temp112 = parseInt(str[112]).toString(2);
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
    var f1 = parseInt(str[24]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[25]).toString(2);
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

  }

  //volvesB
  volvesB(str: any) {
    var f1 = parseInt(str[26]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[27]).toString(2);
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
    this.BhasExe = true;
  }

  volvesPercent(str: any) {
    // this.volvesA(str);
    this.BhasExe = false;
    var arr = new Array();
    var arr1 = new Array();
    for (let i = 30, j = 0; i < 60; i++ , i++ , j++) {
      var str1 = parseInt(str[i + 1]).toString(2);
      var str2 = parseInt(str[i]).toString(2);
      str1 = this.isBinaryof8bit(str1);
      str2 = this.isBinaryof8bit(str2);
      arr[j] = str1 + str2;//存着2进制的数组
    }
    for (var x = 0; x < arr.length; x++) {
      arr1[x] = parseInt(arr[x], 2);
      //看此时B组打开没，打开则要把arr1中的值的2进制取反加1，再做计算
      var isTrue = this.volBhavebac[x];
      if (isTrue) {
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
      }
      var per = ((arr1[x]) / 32767) * 100;
      this.volvesPercentArry[x] = per.toFixed(2) + "%";
    }
  }

  volvesmAmethod(str: any) {//
    this.volvesmAArray[0] = str[121] * 10;//算出来值单位为mA
    this.volvesmAArray[1] = str[120] * 10;
    this.volvesmAArray[2] = str[123] * 10;
    this.volvesmAArray[3] = str[122] * 10;
    this.volvesmAArray[4] = str[125] * 10;
    this.volvesmAArray[5] = str[124] * 10;
    this.volvesmAArray[6] = str[127] * 10;
    this.volvesmAArray[7] = str[126] * 10;
    this.volvesmAArray[8] = str[129] * 10;
    this.volvesmAArray[9] = str[128] * 10;
    this.volvesmAArray[10] = str[131] * 10;
    this.volvesmAArray[11] = str[130] * 10;
    this.volvesmAArray[12] = str[133] * 10;
    this.volvesmAArray[13] = str[132] * 10;
    this.volvesmAArray[14] = str[135] * 10;

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
    var f1 = parseInt(str[136]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[137]).toString(2);
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
    var f1 = parseInt(str[60]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[61]).toString(2);
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
    for (let i = 64, j = 0; i < 94; i++ , i++ , j++) {
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
        this.rawvalue[x] = '0';
      }
    }

  }
  configmethod(str: any) {
    var f1 = parseInt(str[168]).toString(2);
    f1 = this.isBinaryof8bit(f1);
    var f1temp = f1.split('').reverse();
    var f2 = parseInt(str[169]).toString(2);
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
