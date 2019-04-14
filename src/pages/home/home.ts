import { DetailsPage } from './../details/details';
import { BLE } from '@ionic-native/ble';
import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicPage, Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { parseDate } from 'ionic-angular/umd/util/datetime-util';

// 设备 UUIDs
const MY_SERVICE = 'd3dd86a5-d1fc-4227-aa8d-610b6371f442';
const MY_CHARACTERISTIC = 'aa4bd7c3-2906-4b7f-82a9-1cad53a49775';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


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
  temp1: any;
  temp2: any;

  //volves 15

  volAhavebac: any;//为 true  false的数组
  volBhavebac: any;
  //volvesPercent
  volvesPercentArry: any; //数组。存的是类似'0%' 这样的字符串。['0.01%','50%','0%']
  volvesmAArray: any;//数组
  testmA: any;
  str24: any;
  //sensors  15
  fault: any;//数组
  powerbac: any;//数组
  power: any;//数组

  rawvalue: any;//数组
  // config: any;//数组
  myconfig: any;
  Values: any;
  Values2: any;

  ValuesString: any;
  Values2String: any;

  volA: any;

  devicesconsole: any[] = [];
  readdataconsole: any;
  readdataconsole1: any;
  readdataconsole2: any;//200字节中去掉了头尾
  readdataconsole22: any;//200
  readdataconsole3: any;//128字节去掉了头尾
  readdataconsole33: any;//128
  readdataconsole4: any;//328字节去掉了头尾
  readdataconsole44: any;//328
  readdataconsole4arry: any[] = [];
  //和校验
  consolesum: any;
  consolevalidatedec10: any;
  consolesum1: any;
  consolevalidatedec101: any;

  timevalue1: any;
  timevalue2: any;

  sentcount: any = 0;//蓝牙发射的帧数，一条数据被分为两帧来发送
  mydata: number;
  peripheral: any = {};//某个已连接的设备
  peripheralconsole: any;
  myselectcolor: any = "strong";
  enable: boolean = false;
  text1: any;
  text2: any;
  signal: any;
  test: boolean = false;
  itemSelected: boolean = false;
  topShowCon: any = { 'name': '', 'id': '', 'rssi': '' };
  devices: any[] = [];
  deviceshow: any[] = [];
  isScan: boolean = true;
  testdevice: any;
  fab36: any;
  tempdevices: any[] = [];
  statusMessage: string;
  changeName: any;
  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    public setting: OpenNativeSettings,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public plt: Platform
  ) {
    this.text1 = 'Front Rear Value Pack';
    this.text2 = 'MVPE Address 06';
    this.signal = 'STRONG';

    var data111;

    this.ble.isEnabled().then(
      () => {
        this.enable = true;
        this.scan();
      },
      () => { this.enable = false }
    );


    setInterval(() => {
      this.ble.isEnabled().then(
        () => { this.enable = true },
        () => { this.enable = false }
      );
    }, 500);
  }

  //当系统蓝牙没有打开时，点击扫描时的弹窗
  showAlert() {
    const confirm = this.alertCtrl.create({
      title: 'Bluetooth is OFF',
      message: 'Please turn on the bluetooth in your system settings',
      mode:'ios',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.gotosetting();
            // this.plt.exitApp();
            this.navCtrl.pop();//退出该任务栈

          }
        }
      ]
    });
    confirm.present();
  }

  //扫描  配对 成功的加载框

  presentLoading(contents: any, time: any) {
    const loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: contents,
      duration: time,
    });
    loader.present();
  }


  //跳转到蓝牙的系统设置
  gotosetting() {
    this.ble.enable().then(() => { this.enable = true },
      () => { this.enable = false });

    if (this.enable == false) {
      this.setting.open("bluetooth").then(function (value) {
        console.log('成功');
        console.log(value);
        // this.enable = true;
      }, function (error) {
        console.log('失败');
        console.log(error);
        // this.enable = false;
      });
    } else {
      this.enable = true;
    }

  }

  ionViewWillEnter() {
    this.ble.isEnabled().then(
      () => { this.enable = true },
      () => { this.enable = false }
    );
    if (this.enable) {
      this.scan();
    }
  }

  ionViewDidEnter() {
    // this.resolveInfo(this.devices);
    //用于临时测试时，显示模拟数据用。
    //判断蓝牙是否可用
    // this.ble.isEnabled().then(
    //   () => { this.enable = true },
    //   () => { this.enable = false }
    // );

    // if (this.enable === true) {
    //   this.scan();
    // }
  }

  scan() {
    this.itemSelected = false;
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('scan()时已断开连接： ' + JSON.stringify(this.peripheral)),
      () => console.log('scan()时断开蓝牙出错： ' + JSON.stringify(this.peripheral))
    )

    this.ble.isEnabled().then(
      () => { this.enable = true },
      () => { this.enable = false }
    );
    if (this.enable == true) {
      this.presentLoading('Scanning', 2000);
      // this.setStatus('正在扫描蓝牙设备...');
      this.devices = [];
      this.ble.scan([], 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );
      // this.resolveInfo(this.devices);
    } else {
      this.showAlert();
    }
    setTimeout(() => {
      this.isScanSomething()
    }, 50);
  }
  isScanSomething() {
    if (this.devices.length > 0) {
      this.isScan = true;
    }

  }
  onDeviceDiscovered(device: any) {
    console.log('扫描到了： ' + JSON.stringify(device, null, 2));
    this.testdevice = JSON.stringify(device, null, 2);
    this.ngZone.run(() => {
      device.rssi = (parseInt(device.rssi)) > -70 ? 'STRONG' : 'WEAK';
      for (var key in device) {
        if (key == 'name') {
          console.log('有name');
          // var sli = '';
          // sli = device.id +'';
          // device.id = sli.slice(0,13)+'...';

          this.devices.push(device);
          this.devicesconsole.push(JSON.stringify(device, null, 2));
        }
      }
    });
    // this.resolveInfo(this.devices);
  }

  //处理信号强度
  resolveInfo(deviceinfo: any) {
    for (let index = 0; index < deviceinfo.length; index++) {
      if (parseInt(deviceinfo[index].rssi) > -70) {
        deviceinfo[index].rssi = 'STRONG';
        // this.myselectcolor = "strong";
      } else {
        deviceinfo[index].rssi = 'WEAK';
        // this.myselectcolor = "weak"

      }

    }
    //  this.devices
  }
  scanError(error: any) {
    // this.presentLoading('Scanning failed',2000);
    // this.setStatus('错误 ' + error);
    let toast = this.toastCtrl.create({
      message: 'Scanning failed',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  // setStatus(message) {
  //   console.log(message);
  //   this.ngZone.run(() => {
  //     this.statusMessage = message;
  //   });
  // }

  // deviceSelected(device) {
  //   console.log(JSON.stringify(device) + ' 打印的详细信息--蓝牙被选中连接');
  //   this.navCtrl.push(DetailPage, {
  //     device: device
  //   });
  // }


  deviceOnlySelected(device) {

    // this.navCtrl.push(DetailsPage, {
    //   device: device
    // });

    //首先断开之前连接的某个蓝牙
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('已断开连接： ' + JSON.stringify(this.peripheral)),
      () => console.log('断开蓝牙出错： ' + JSON.stringify(this.peripheral))
    )

    this.ble.connect(device.id).subscribe(
      peripheral => {
        this.onConnected(peripheral);
        this.test = true;//为真表示蓝牙走到这一步了，连接成功 ，不用下面if中的那四行测试代码进行模拟数据
        this.itemSelected = true;
        // var sli = '';
        // sli = device.id +'';
        this.topShowCon.id = device.id;
        this.topShowCon.name = device.name;
        // this.topShowCon.rssi = device.rssi;
        this.topShowCon.rssi = (peripheral.rssi > (-70)) ? 'STRONG' : 'WEAK';
      },
      peripheral => {
        this.presentLoading("Time out", 1000);

      }
    );
  }

  onConnected(peripheral) {

    this.presentLoading('Success', 1000);
    this.peripheral = peripheral;//某个已连接的设备
    this.peripheralconsole = JSON.stringify(peripheral);
    // this.setStatus('已连接： ' + (peripheral.name || peripheral.id));
    console.log('设备连接信息：' + this.peripheralconsole);

    //模拟处理
    // this.model();

    // this.ble.startNotification(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).subscribe(
    //   data => {
    //     this.onDataChange(data);
    //     this.sentcount++;
    //   }, () => { }
    // )

    // // 读该时刻的值
    // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
    //   data => this.onDataChange(data), () => { }
    // )


  }

  model() {
    var aa = "170,187,23,33,0,200,104,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,201,176,8,249,0,0,0,0,6,39,6,39,51,33,119,120,4,0,3,2,0,1,1,2,0,0,3,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1,0,0,0,2,1,0,64,62,5,144,1,144,1,144,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
    var bb = aa.split(',');
    // this.reso(bb);

  }


  onDataChange(buffer: ArrayBuffer) {
    //sentcount为偶数，表示一整条数据的发送开始即200字节的那帧开始发。为奇数，表示128字节的那帧数据在发
    if (this.sentcount % 2 == 0) {//200字节开始发
      var data = new Uint8Array(buffer);
      var data1 = new Uint8Array(buffer) + '';
      console.log("data[197]的值" + data[198] + '-----------' + 'data的值' + data);
      console.log("200字节数据" + data);
      console.log("200字节数据加了''符号。。。" + data1);
      this.ngZone.run(() => {
        var str = data + '';
        var strs = new Array(); //定义一数组 
        var strs1 = new Array();


        var j = 0;///

        var sum = 0;
        var validate3 = '';
        var validate3to2 = '';
        var validate4 = '';
        var validate4to2 = '';
        var validatesum = '';
        var validatedec10 = 0;


        strs = str.split(',');///


        //和校验，从第三个字节开始累加，到倒数第五个字节为止。
        for (let index = 2; index < strs.length - 4; index++) {
          sum += parseInt(strs[index]);
        }
        //倒数第三个四个字节拼接起来
        validate4 = strs[strs.length - 4];
        validate3 = strs[strs.length - 3];
        validate4to2 = parseInt(validate4).toString(2);
        var two = parseInt(validate3).toString(2);
        if (8 - two.length != 0) {
          var y = 8 - two.length;
          for (var i = 0; i < y; i++) { validate3to2 += '0'; }
          validate3to2 += two;
          validatesum = validate4to2 + validate3to2;
          validatedec10 = parseInt(validatesum, 2);
        } else {
          validate3to2 = two;
          validatesum = validate4to2 + validate3to2;
          validatedec10 = parseInt(validatesum, 2);
        }
        this.readdataconsole22 = data;
        this.consolesum = sum;
        this.consolevalidatedec10 = validatedec10;
        console.log('200字节的sum = ' + sum + ',validate = ' + validatedec10);


        for (var i = 0; i < strs.length - 4; i++) {//去掉后4个字节
          strs1[j] = strs[i];
          j++;
        }
        var strs2 = strs1.toString();
        this.readdataconsole2 = strs2;
        console.log('200字节去掉尾的数据' + strs2);
      });

    } else {//128字节开始发
      var data = new Uint8Array(buffer);
      console.log("data[125]的值" + data[125] + '-----------' + 'data的值' + data);
      console.log("128字节数据" + data);

      this.ngZone.run(() => {
        var str = data + '';
        var strs = new Array(); //定义一数组 
        var strs1 = new Array();
        var j = 0;

        var sum = 0;
        var validate3 = '';
        var validate3to2 = '';
        var validate4 = '';
        var validate4to2 = '';
        var validatesum = '';
        var validatedec10 = 0;
        strs = str.split(",");
        //和校验，从第三个字节开始累加，到倒数第五个字节为止。
        for (let index = 2; index < strs.length - 4; index++) {
          sum += parseInt(strs[index]);
        }

        //倒数第三个四个字节拼接起来
        validate4 = strs[strs.length - 4];
        validate3 = strs[strs.length - 3];
        validate4to2 = parseInt(validate4).toString(2);

        var two = parseInt(validate3).toString(2);
        if (8 - two.length != 0) {
          var y = 8 - two.length;
          // var mystr = '';
          for (var i = 0; i < y; i++) { validate3to2 += '0'; }
          validate3to2 += two;
          validatesum = validate4to2 + validate3to2;
          validatedec10 = parseInt(validatesum, 2);
        } else {
          validate3to2 = two;
          validatesum = validate4to2 + validate3to2;
          validatedec10 = parseInt(validatesum, 2);
        }

        this.consolesum1 = sum;
        this.consolevalidatedec101 = validatedec10;
        console.log('128字节的sum = ' + sum + ',validate = ' + validatedec10);

        for (var i = 6; i < strs.length - 6; i++) {//去掉前6字节与后6个字节
          strs1[j] = strs[i];
          j++;
        }
        var strs2 = strs1.toString();
        this.readdataconsole33 = data;
        this.readdataconsole3 = strs2;
        this.readdataconsole4 = this.readdataconsole2 + ',' + this.readdataconsole3;
        this.readdataconsole44 = this.readdataconsole22 + ',' + this.readdataconsole33;
        console.log('128字节去掉头尾的数据' + strs2);
        console.log("拼接数据的字符串形式(去掉了头尾)" + this.readdataconsole4);
        console.log("拼接数据的字符串形式" + this.readdataconsole44);

        //把拼接的数据转换为数组形式，便于数据解析
        var ss = this.readdataconsole4;
        var strsss = new Array(); //定义一数组 
        strsss = ss.split(',');
        this.readdataconsole4arry = strsss;
        console.log("拼接数据的数组形式(去掉了头尾)：" + strsss);
      });

    }

  }

  connected(topShowCon, peripheralconsole) {
    this.navCtrl.push(DetailsPage, { device: topShowCon, periphers: peripheralconsole });
  }

  swipeEvent($event) {
    this.presentPrompt();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Modify name',
      message: 'Do you want to modify the name of peripheral?',
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
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(typeof (data.name));
            let dataIsOk = this.reTest(data.name);
            let tempdata = data.name + '';
            if (dataIsOk) {
              //发送数据
              var arr = [];
              for (var i = 0, j = tempdata.length; i < j; ++i) {
                arr.push(tempdata.charCodeAt(i));
              }
              var dataSend = new Uint8Array(arr);

              this.ble.write(this.topShowCon.id, MY_SERVICE, MY_CHARACTERISTIC, dataSend.buffer).then(() => {
                // this.presentAlertTest();
                //扫描蓝牙设备
                this.scan();
              }, e => {
                this.presentAlertTest1();
              });

            }
          }
        }
      ]
    });
    alert.present();
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
  // var re =  /^[0-9a-zA-Z]*$/;
  reTest(mystr) {
    var revalue = /^\w{1,19}$/;
    var revalue2 = /^[^\s]*$/;
    if (revalue.test(mystr) && revalue2.test(mystr)) {
      return true;
    }
    this.presentAlert();
    return false;
  }
  presentAlertTest() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      buttons: ['Ok']
    });
    alert.present();
  }
  presentAlertTest1() {
    let alert = this.alertCtrl.create({
      title: 'Failed',
      buttons: ['Ok']
    });
    alert.present();
  }
}
