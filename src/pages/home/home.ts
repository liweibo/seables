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
  mvpeNameallhome: any = "";


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
  consolesend: any;
  timevalue1: any;
  timevalue2: any;
  changeNameRes: any;
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
      mode: 'ios',
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
      duration: 2000,
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
        setTimeout(() => {
          this.senRequestMVPEname();
        }, 500);
        // this.presentLoading(this.mvpeNameallhome, 5000);
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
  onDataChangeName(buffer: ArrayBuffer) {
    var data = new Uint8Array(buffer);
    this.changeNameRes = data[3];
    this.presentLoading("修改name的返回码：" + data[3], 6000);
  }

  onDataChange(buffer: ArrayBuffer) {
    var data = new Uint8Array(buffer);
    this.ngZone.run(() => {
      var str = data + '';
      var strs = new Array(); //定义一数组 
      strs = str.split(',');///

      if (strs[3] == 115) {//mvpename获取的返回功能码
        var mvpeName = "";
        if (strs.length > 6) {
          for (var i = 4; i < strs.length - 2; i++) {
            //ascii转为字符
            mvpeName += String.fromCharCode(data[i]);
          }
        }

        this.mvpeNameallhome = mvpeName;
      }

      if (strs[3] == 114) {//修改mvpename的返回功能码
        if (strs[4] == 1) {
          //修改成功
          this.tosatMethod("The MVPE NAME was successfully modified");
        }
        if (strs[4] == 0) {
          //修改失败Name modification failed
          this.tosatMethod("The MVPE NAME modification failed");

        }
      }

    });




  }

  tosatMethod(messa) {
    let toast = this.toastCtrl.create({
      message: messa,
      position: 'top',
      duration: 2000,
    });
    toast.present();
  }

  connected(topShowCon, peripheralconsole, mvpeNameallhome) {

    this.ble.disconnect(topShowCon.id).then(
      () => { },
      () => { }
    );
    setTimeout(() => {
      this.navCtrl.push(DetailsPage, {
        device: topShowCon, periphers: peripheralconsole,
        fromhome: mvpeNameallhome
      });
    }, 1500);
  }

  swipeEvent($event) {
    this.presentPrompt();
  }
  pressEvent($event) {
    this.presentPromptMVPE();
  }
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Modify name',
      message: 'Do you want to modify the name of bluetooth board?',
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
              //发送数据
              // var arr = [];
              // for (var i = 0, j = tempdata.length; i < j; ++i) {
              //   arr.push(tempdata.charCodeAt(i));
              // }
              // var dataSend = new Uint8Array([]);
              // dataSend = new Uint8Array(arr);

              // this.consolesend = JSON.stringify(dataSend.buffer);
              // this.ble.write(this.topShowCon.id, MY_SERVICE, MY_CHARACTERISTIC, dataSend.buffer).then(() => {
              //   // this.presentAlertTest();
              //   // this.mendName();//断开  再连接
              //   //扫描蓝牙设备
              //   this.scan();//再断开 再扫描
              // }, e => {
              //   this.presentAlertTest1();
              // });

              this.senRequestChangeName(tempdata);

            }
          }
        }
      ]
    });
    alert.present();
  }

  presentPromptMVPE() {
    let alert = this.alertCtrl.create({
      title: 'Modify name',
      message: 'Do you want to modify the name of MVPE board?',
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
              this.senRequestChangeMVPEName(tempdata);

            }
          }
        }
      ]
    });
    alert.present();
  }


  //修改设备蓝牙名字
  senRequestChangeName(peripheralName: any) {
    // var incre = this.increaseValueChangeName + "";
    // var dataLen = 1 + peripheralName.length;//字节个数
    // var dataLenStr = 1 + peripheralName.length + "";//字节个数(字符串形式)

    // var nameSum = 0;
    // for (var i = 0, j = peripheralName.length; i < j; ++i) {
    //   nameSum += peripheralName.charCodeAt(i);
    // }
    // var validateSum = this.increaseValueChangeName + dataLen + 48 + nameSum + "";
    // var beforeName = "170|" + incre + "|" + dataLenStr + "|48|";
    // var afterName = "|" + validateSum + "|187";
    // var sendStr = beforeName + peripheralName + afterName;//发送帧格式
    // //设备名
    // var arr = [];
    // for (var i1 = 0, j1 = sendStr.length; i1 < j1; ++i1) {
    //   arr.push(sendStr.charCodeAt(i1));
    // }
    // var dataSend = new Uint8Array([]);
    // dataSend = new Uint8Array(arr);


    var lenArr = peripheralName.length + 6;
    var data = new Uint8Array(lenArr);
    data[0] = 0xAA;
    data[1] = 0;
    data[2] = 2;
    data[3] = 0x30;

    var nameSum = 0;
    for (var i = 0; i < peripheralName.length; ++i) {//////////////i  j
      data[i + 4] = peripheralName.charCodeAt(i);
      nameSum += peripheralName.charCodeAt(i);
    }
    var Checksum = 2 + 48 + nameSum;

    data[lenArr - 2] = Checksum;
    data[lenArr - 1] = 0xBB;
    this.ble.write(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      //   data => this.onDataChangeName(data), () => { }
      // )
      // this.presentLoading("修改name数据指令发送成功", 2500);
      this.scan();//再断开 再扫描
    }, e => {
      this.presentAlertTest2();
    });
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
    for (var i = 0; i < peripheralName.length; ++i) {//////////////i  j
      data[i + 4] = peripheralName.charCodeAt(i);
      nameSum += peripheralName.charCodeAt(i);
    }
    var Checksum = 2 + 50 + nameSum;

    data[lenArr - 2] = Checksum;
    data[lenArr - 1] = 0xBB;
    this.ble.write(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      //   data => this.onDataChangeName(data), () => { }
      // )
      // this.presentLoading("修改name数据指令发送成功", 2500);
      this.scan();//再断开 再扫描
    }, e => {
      this.presentAlertTest2();
    });
  }


  presentAlertTest2() {
    let alert = this.alertCtrl.create({
      title: 'change ble name  instruction failed',
      buttons: ['Ok'],
      mode: 'ios'
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
      buttons: ['Ok'],
      mode: 'ios'
    });
    alert.present();
  }
  presentAlertTest1() {
    let alert = this.alertCtrl.create({
      title: 'Failed',
      buttons: ['Ok'],
      mode: 'ios'
    });
    alert.present();
  }

  mendName() {
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
      this.ble.connect(this.peripheral.id).subscribe(
        peripheral => {
        },
        peripheral => {
        }
      );
    }
  }


  //获取mvpe板的名字
  senRequestMVPEname() {
    var data = new Uint8Array(6);
    data[0] = 0xAA;

    data[1] = 0;
    data[2] = 1;
    data[3] = 0x33;
    var Checksum = 1 + 51;
    data[4] = Checksum;
    data[5] = 0xBB;

    this.ble.write(this.topShowCon.id, MY_SERVICE, MY_CHARACTERISTIC, data.buffer).then(() => {
      this.presentLoading("MVPE name获取指令发送成功", 1500);
      // this.ble.read(this.peripheral.id, MY_SERVICE, MY_CHARACTERISTIC).then(
      //   data => this.onDataChangeMVPEName(data), () => { }
      // )
      this.ble.startNotification(this.topShowCon.id, MY_SERVICE, MY_CHARACTERISTIC).subscribe(
        data => {
          this.onDataChange(data);
        }, () => { }
      );

    }, e => {
      this.presentAlertTestMvpeName();
    });
  }

  onDataChangeMVPEName(buffer: ArrayBuffer) {//读取mvpe name
    var data = new Uint8Array(buffer);
    var mvpeName = "";
    for (var i = 4; i < data.length - 2; i++) {
      //ascii转为字符
      mvpeName += String.fromCharCode(data[i]);
    }
    // this.mvpeNameall = mvpeName;
    this.presentLoading("读取MVPEname：" + data, 6000);
  }
  presentAlertTestMvpeName() {
    let alert = this.alertCtrl.create({
      title: 'Get MVPE name instruction failed',
      buttons: ['Ok'],
      mode: 'ios'

    });
    alert.present();
  }
}
