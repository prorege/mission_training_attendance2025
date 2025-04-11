function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById("1MZ9Z76gE5lunNPcSJoqxxv8oTWC2TtwxFPFSupZ31VE").getSheetByName("출석부");
    var data = JSON.parse(e.postData.contents);
    var name = data.name;
    var weekLabel = data.week;

    if (!weekLabel) {
      sheet.appendRow([name, "기록 실패: 주차 없음"]);
      return ContentService.createTextOutput("주차 정보 없음");
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var col = headers.indexOf(weekLabel) + 1;
    if (col === 0) {
      col = headers.length + 1;
      sheet.getRange(1, col).setValue(weekLabel);
    }

    var names = sheet.getRange(2, 1, sheet.getLastRow() - 1).getValues();
    for (var i = 0; i < names.length; i++) {
      if (names[i][0] === name) {
        sheet.getRange(i + 2, col).setValue("출석");
        return ContentService.createTextOutput("출석 완료");
      }
    }

    sheet.appendRow([name, "기록 실패: 이름 미일치"]);
    return ContentService.createTextOutput("이름을 찾을 수 없음");

  } catch (err) {
    return ContentService.createTextOutput("오류 발생: " + err.message);
  }
}
