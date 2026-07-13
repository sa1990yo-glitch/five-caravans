// كود لوحة التحكم العامة - إدارة الحركات المباشرة
document.addEventListener("DOMContentLoaded", function () {
  renderDashboardTable();

  const inputForm = document.getElementById("dashboard-input-form");
  if (inputForm) {
    inputForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const empName = document.getElementById("dashboard-emp-name").value.trim();
      const actionType = document.getElementById("dashboard-action-type").value;
      const status = document.getElementById("dashboard-status").value;

      if (!empName) {
        alert("الرجاء إدخال اسم الموظف");
        return;
      }

      const currentDateTime = new Date().toLocaleString('ar-SA', { hour12: true });

      const newRecord = {
        id: Date.now(),
        name: empName,
        type: actionType,
        date: currentDateTime,
        status: status
      };

      let records = JSON.parse(localStorage.getItem("dashboard_records")) || [];
      records.unshift(newRecord);
      localStorage.setItem("dashboard_records", JSON.stringify(records));

      renderDashboardTable();
      inputForm.reset();
    });
  }
});

function renderDashboardTable() {
  const tableBody = document.getElementById("dashboard-table-body");
  if (!tableBody) return; // حماية في حال كانت الصفحة مختلفة

  const records = JSON.parse(localStorage.getItem("dashboard_records")) || [];
  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">لا توجد حركات مسجلة اليوم.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  records.forEach(r => {
    tableBody.innerHTML += `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-right">
        <td class="p-3 font-bold text-slate-800">${r.name}</td>
        <td class="p-3 text-slate-600">${r.type}</td>
        <td class="p-3 text-slate-500 font-mono">${r.date}</td>
        <td class="p-3"><span class="px-2 py-1 rounded-md text-xs font-bold ${r.status === 'تمت الموافقة' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${r.status}</span></td>
        <td class="p-3"><button onclick="deleteDashboardRecord(${r.id})" class="text-red-500 hover:underline">حذف</button></td>
      </tr>`;
  });
}

function deleteDashboardRecord(id) {
  if (confirm("هل تريد حذف هذا الإجراء؟")) {
    let records = JSON.parse(localStorage.getItem("dashboard_records")) || [];
    records = records.filter(r => r.id !== id);
    localStorage.setItem("dashboard_records", JSON.stringify(records));
    renderDashboardTable();
  }
}
