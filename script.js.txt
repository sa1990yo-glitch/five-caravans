// دالة التنقل الآمن بين الصفحات في بيئة CodePen
const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page-content');

function switchPage(pageId, activeButton) {
  pages.forEach(page => {
    page.classList.add('hidden');
    page.classList.remove('block');
  });
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    targetPage.classList.add('block');
  }

  buttons.forEach(btn => {
    btn.classList.remove('bg-white/10', 'text-white');
    btn.classList.add('text-blue-100');
  });

  activeButton.classList.add('bg-white/10', 'text-white');
}

// ربط أحداث الضغط لجميع الأزرار الـ 8 بشكل مستقل وصريح
document.getElementById('btn-dashboard').onclick = function() { switchPage('page-dashboard', this); };
document.getElementById('btn-employees').onclick = function() { switchPage('page-employees', this); };
document.getElementById('btn-qiwa').onclick = function() { switchPage('page-qiwa', this); };
document.getElementById('btn-iqama').onclick = function() { switchPage('page-iqama', this); };
document.getElementById('btn-advances').onclick = function() { switchPage('page-advances', this); };
document.getElementById('btn-deductions').onclick = function() { switchPage('page-deductions', this); };
document.getElementById('btn-leaves').onclick = function() { switchPage('page-leaves', this); };
document.getElementById('btn-reports').onclick = function() { switchPage('page-reports', this); };

// دالة التصدير للنظام بصيغة CSV المتوافقة مع الإكسيل واللغة العربية
function exportTableToCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;
  let csv = [];
  const rows = table.querySelectorAll("tr");
  
  for (let i = 0; i < rows.length; i++) {
    let row = [], cols = rows[i].querySelectorAll("td, th");
    for (let j = 0; j < cols.length; j++) {
      let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
      row.push('"' + text + '"');
    }
    csv.push(row.join(","));
  }
  
  const csvContent = "\uFEFF" + csv.join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// تشغيل أزرار التصدير للتقارير
document.getElementById('export-new-employees').onclick = function() {
  exportTableToCSV('table-new-employees', 'تقرير_الموظفين_الجدد.csv');
};

document.getElementById('export-leaving-employees').onclick = function() {
  exportTableToCSV('table-leaving-employees', 'تقرير_الموظفين_المغادرين.csv');
};
