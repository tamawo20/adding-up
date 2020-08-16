'use strict'
const fs = require('fs');//ファイルシステムモジュールを使うファイルを読むということ
const readline = require('readline');//一行ずつ読み込んで
const rs = fs.createReadStream('./popu-pref.csv');//ｃｓｖファイルを読み込む
const rl = readline.createInterface({ 'input': rs, 'output': {} });//APIを使っているだけ、一行だけよむ
const prefectureDataMap = new Map(); //key:都道府県valure:集計データのオブジェクト
rl.on('line', (lineString) => {//どの「イベントを検知する？一行読めたよイベントの時に以下の関数を実行してください
    const columns = lineString.split(',');//columnsつまり列をカンマで区切って配列に変換
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);//データを持っているかをチェック
        if (!value) {//ノットバリューつまりデータを持っていないときは
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){//もし2010年のものだったら
            value.popu10 = popu;//value.popu10に代入
        }
        if (year === 2015){
            value.popu15 = popu;   
        }
        prefectureDataMap.set(prefecture, value);//オブジェクトをセット
    }
});
rl.on('close', () => {//ファイル全部読み終わったら
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray =Array.from(prefectureDataMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key,value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;

    });

    console.log (rankingStrings);

});

