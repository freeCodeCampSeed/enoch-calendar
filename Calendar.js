// module.exports = class Calendar {
//  export default class Calendar {
export class Calendar { 
  constructor(_date = new Date())
    {
      this.atDate(_date);
    }

    atDate (_date)
    {
      console.log('atDate: ' + _date);
      let lastYear = parseInt(_date.getFullYear()) - 1;
      let isNotLeap = parseInt(_date.getFullYear())%4;
      this.day_milli = 86400000;
      let date_time = lastYear%4 ? '03-17T05:46:00' : '03-16T05:46:00'; // check if last year was leap year, yes ${lastYear}-03-16T05:46:00 else ${lastYear}-03-17T05:46:00
      this.d1 = new Date(`${lastYear}-${date_time}`); 
      // this.d1 = new Date('2020-03-17T05:46:00');
      // this.number_days_milli = 86400000;
      let addLeap = (!isNotLeap && (this.d1.getMonth()==1 && this.d1.getUTCDate()==29)) || ( !isNotLeap && this.d1.getMonth() < 1 ) ? this.day_milli : 0
      this.today = _date+addLeap; //new Date(); //new Date('2021-03-17T05:46:00');

     
      // this.number_days_milli = (this.today - this.d1); //-(day_milli);
      this.number_days_milli = new Date(this.today).getTime()-this.d1.getTime(); //(this.today - this.d1);

      // this.total_days = this.number_days_milli/(this.day_milli)
      // this.day_of_year = this.total_days - (364);
      this.total_days = this.number_days_milli/(this.day_milli)%365;
      this.day_of_year = this.total_days+1;// - (364);

      // this._day = this.day_of_year;
      // this._month = this._day<1 ? 12 : ( parseInt((this._day/30)%1 > 0  && (this._day!=91&&this._day!=182&&this._day!=273&&this._day!=364) ? (this._day/30)+1 : (this._day/30)) );
      this._day = parseInt(this.day_of_year);
      this._month = this._day<1 || (this._day > 360 && this._day <= 365) ? 12 : ( parseInt((this._day/30)%1 > 0  && (this._day!=91&&this._day!=182&&this._day!=273&&this._day!=364) ? (this._day/30)+1 : (this._day/30)) );
    }

    get todayFormatted()
    {
        return parseInt(this._today);
    }

    get day()
    {
        return parseInt(this._day);
    }

    get month()
    {
        return this._month;
    }

    get date()
    {
        // let _date = this.day==91||this.day==182||this.day==273||this.day==364 ? 31 : (this.day%30 == 0) ? 30 : this.day%30;
        let _date = this.day==91||this.day==182||this.day==273||this.day==364 ? 31 : (this.day%30 == 0) ? 30 : (this.day%30)-Math.floor(((this.day/30)/3));
        let holyday = HolyDays.query('month'+this.month, _date); 

        return {
            number: _date,
            holyday: holyday
        };
    }

    holydays(month)
    {
      let _days = HolyDays['month'+month]; 
      return {
        days: _days || null
      }
    }

    get isSabbath()
    {
        return this.day%7 ? false : true;
    }
};

let HolyDays = {
    month1 : {
      '1': {
        name: "New Year",
        scripture: "Exodus 12:2",
        isSabbath: false
      },
      '14': {
        name: "Passover",
        scripture: "Leviticus 23:5; Deut. 16:1-16; Exodus 12:6-20;26-27; Numbers 9:1-14",
        isSabbath: false
      },
     '15': {
        name: "First day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: true,
      }, 
      '16': {
        name: "Second day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: false
      },
          '17': {
        name: "Third day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: false
      },
          '18': {
        name: "Fourth day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: false
      },
          '19': {
        name: "Fifth day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: false
      },
          '20': {
        name: "Sixth day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: false
      },
          '21': {
        name: "Seventh day Feast of Unleavened Bread",
        scripture: "Leviticus 23:6-8; Deut. 16:1-16; Exodus 12:15-20",
        isSabbath: true
      }
    },
    month7: {
     '1': {
       name: "The Feast of Trumpets",
       scripture: "Leviticus 23:23-25; Numbers 29:1-6; Psa 81:3",
       isSabbath: true
     },
      '9': {
        name: "Evening sabbath before Day of Atonement",
        scripture: "Leviticus 23:26-32; Numbers 29:7-11",
        isSabbath: true
      },
      '10': {
        name: "The Day of Atonement",
        scripture: "Leviticus 23:26-32; Numbers 29:7-11",
        isSabbath: true
      },
      '15': {
        name: "Day 1 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: true
      },
      '16': {
        name: "Day 2 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: false
      },
      '17': {
        name: "Day 3 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: false
      },
       '18': {
        name: "Day 4 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: false
      },
      '19': {
        name: "Day 5 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: false
      },
       '20': {
        name: "Day 6 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: false
      },
      '21': {
        name: "Day 7 Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: false
      },    
      '22': {
        name: "Day 8 Sabbath Feast of Tabernacles",
        scripture: "Leviticus 23:33-44; Nehemiah 8:13-18",
        isSabbath: true
      }
    },
    
    query(month, day)
    {
        // let out = this[month][day] ? this[month][day] : {name:false,scripture:false,isSabbath:false};
        // return out;
        // console.log(`month: ${month}, day: ${day}, this: ${this[month][day]}`);
          let out = (typeof this[month] !== 'undefined') && (typeof this[month][day] !== 'undefined') ? this[month][day] : {
            name:false,
            scripture:false,
            isSabbath:false
        };

        return out
    },

    // async bibleSearch(query, verse_numbers=false)
    // {
    //     const regex = /<[^>]*>/ig;
    //     query = query.replace(regex, '');

    //     let response = await fetch(`https://bible-api.com/${query}?translation=kjv&verse_numbers=${verse_numbers}`);
    //     let verse = await response.json()
        
    //     return verse;
    // }
    bibleSearch(query, verse_numbers=false, scripture)
    {
        const regex = /<[^>]*>/ig;
        let ql = query.split('; ');
        ql.forEach( _query => { 
          let q = _query.replace(regex, '');
          // console.log(q)
          
          // fetch(`https://bible-api.com/${query}?translation=kjv&verse_numbers=${verse_numbers}`)
          // .then( response => response.json())
          // .then( verse => {
          //   out.push(verse);
          // })
          // .catch(e => console.log(e))
          
          search(q, verse_numbers)
          .then(data => {
          scripture.innerHTML += data.text;
          // console.log(data.text)
         })
         .catch(e => console.log(e));
          
        })
      
      return 'Test: ' + textback;
    }
  };

  async function search(query, verse_numbers)
    {
            let response = await fetch(`https://bible-api.com/${query}?translation=kjv&verse_numbers=${verse_numbers}`);
            let verse = await response.json();
    
        return verse;
    }

    // let scriptures = document.querySelector('.scripture');
    // HolyDays.bibleSearch(HolyDays['month1'][14].scripture, true, scriptures);


//   let p = "Leviticus 23:<span class='bold-verse'>33-44</span>; Nehemiah 8:13-18";
//   const regex = /<[^>]*>/ig;
//   console.log(p.replace(regex, ''));

// let cal = new Calendar();
// let month = cal.month;
// let day   = cal.day;
// let date  = cal.date;
// let sabbath = cal.isSabbath;

// console.log('This month: ' + month)
// console.log('This day: ' + day)
// console.log('This date: ' + date.number)
// console.log('This Sabbath: ' + sabbath)
// console.log('Is Holy day: ' + date.holyday.name)
// console.log('Is Holy day: ' + HolyDays.query('month'+month, 14).name)

// console.log('Month ' + parseInt((day/30)%1 > 0 ? ((day!=91||day!=182||day!=273||day!=364) ?(day/30)+1  : (day/30)) : (day/30)))

// let service = 'http://getbible.net/json?p=Num10:10';
/*
single verse
https://bible-api.com/john 3:16
abbreviated book name
https://bible-api.com/jn 3:16
verse range
https://bible-api.com/romans+12:1-2
multiple ranges
https://bible-api.com/romans 12:1-2,5-7,9,13:1-9&10
different translation
https://bible-api.com/john 3:16?translation=kjv
verse numbers
https://bible-api.com/john 3:16?verse_numbers=true
jsonp
https://bible-api.com/john+3:16?callback=func
*/

/*
let service = 'https://bible-api.com/Ex 12:1-2?translation=kjv';

fetch(service)
    .then(res => {
        return res.json();
    })
    .then( data => {
        console.log(data, data.text);
        nys.innerHTML = data.text;
    })

async function bibleSearch(query, verse_numbers=false)
{
  let response = await fetch(`https://bible-api.com/${query}?translation=kjv&verse_numbers=${verse_numbers}`);
  let verse = await response.json()
  
  return verse;
}

function onSearch(scripture, resp=false)
{
    bibleSearch(scripture, true)
    .then(verse => {
        let data = verse.text.replace(/(\n\()/g, '<br>(');
        if ( resp )
            resp.innerHTML = data;
        else 
            document.querySelector('.verse').innerHTML = data;
        //console.log(data)
    })
    .catch(err => console.log(err))
}

*/


// 86400000
// let millisec = 1000;
// let second = millisec;
// let minute = 60*second;
// let hour   = 60*minute;
// let day    = 24*hour;

// let daymilli = (1000*60*60*24);
// let completeDay = (1440*60*1000)
// console.log(daymilli);
// console.log(completeDay);
