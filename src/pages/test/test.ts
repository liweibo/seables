import { ModalPage } from './../modal/modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JsonPipe } from '@angular/common';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  consolesend:any;
  consolesend1:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    
    console.log( this.initData() );
  
  }

  async initData(){
    let result = function(){
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          // if (this.readdataconsole4arry.length > 310) {
          //   this.reso(this.readdataconsole4arry);
          // }
          resolve(1);
        },3000);
      });
    }
    let data = await result();
    console.log(data);
    this.initData();
    return data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');

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
            console.log(typeof( data.name));
           let dataIsOk = this.reTest(data.name);
           if (dataIsOk) {
             //发送数据
            //  this.presentAlertTest();
            let tempdata = data.name + '';
            var arr = [];
            for (var i = 0, j = tempdata.length; i < j; ++i) {
              arr.push(tempdata.charCodeAt(i));
            }
            var dataSend = new Uint8Array([]);
            dataSend = new Uint8Array(arr);

            this.consolesend =JSON.stringify(dataSend.buffer) ;
           var ss =dataSend.buffer;
           this.consolesend1 = ss;
          var myva = String.fromCharCode.apply(null, new Uint8Array(ss));
           console.log('name:'+myva );

           }else
           {
            //  this.presentAlertTest1();
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
    var revalue =/^\w{1,19}$/;
    var revalue2 = /^[^\s]*$/;
    if (revalue.test(mystr) && revalue2.test(mystr)) {
      return true;
    }
    this.presentAlert();
    return false;
  }

  presentAlertTest() {
    let alert = this.alertCtrl.create({
      title: '写数据成功',
      mode: 'ios',
      buttons: ['Ok']
    });
    alert.present();
  }
  presentAlertTest1() {
    let alert = this.alertCtrl.create({
      title: '写数据失败',
      buttons: ['Ok']
    });
    alert.present();
  }
}
