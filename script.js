document.addEventListener("DOMContentLoaded", function () {
  // التعرف التلقائي على الصفحة المفتوحة وتشغيل الجداول الخاصة بها
  if (document.getElementById("dashboard-live-table")) {
    renderDashboardTable();
  }
  if (document.getElementById("employees-live-table")) {
    renderEmployeesTable();
  }

  // ترحيل بيانات لوحة التحكم
  const inputForm = document.getElementById("dashboard-input-form");
  if (inputForm) {
    inputForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const empName = document.getElementById("dashboard-emp-name").value.trim();
      const actionType = document.getElementById("dashboard-action-type").value;
      const status = document.getElementById("dashboard-status").value;
      const currentDateTime = new Date().toLocaleString('ar-SA', { hour12: true });

      const newRecord = { name: empName, action: actionType, date: currentDateTime, status: status };
      let currentRecords = JSON.parse(localStorage.getItem("five_caravans_main_data")) || [];
      currentRecords.unshift(newRecord);
      localStorage.setItem("five_caravans_main_data", JSON.stringify(currentRecords));

      renderDashboardTable();
      document.getElementById("dashboard-emp-name").value = "";
    });
  }

  // ترحيل بيانات الموظفين والإقامات
  const empForm = document.getElementById("employee-input-form");
  if (empForm) {
    empForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const fullName = document.getElementById("emp-fullname").value.trim();
      const idNumber = document.getElementById("emp-id-number").value.trim();
      const jobTitle = document.getElementById("emp-job").value;

      const newEmp = { id: Date.now(), name: fullName, iqama: idNumber, job: jobTitle };
      let currentEmps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
      currentEmps.unshift(newEmp);
      localStorage.setItem("five_caravans_employees", JSON.stringify(currentEmps));

      renderEmployeesTable();
      empForm.reset();
    });
  }
});

// دوال عرض الجداول
function renderDashboardTable() {
  const tableBody = document.getElementById("dashboard-live-table");
  if (!tableBody) return;
  const records = JSON.parse(localStorage.getItem("five_caravans_main_data")) || [];
  tableBody.innerHTML = records.length === 0 ? `<tr><td colspan="4" class="py-4 text-center text-gray-400">فارغ.</td></tr>` : "";
  
  records.forEach(record => {
    let statusStyle = record.status === "تمت الموافقة" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700";
    tableBody.innerHTML += `
      <tr class="border-b border-gray-100">
        <td class="py-3 font-bold">${record.name}</td><td>${record.action}</td><td class="text-gray-400 font-mono" dir="ltr">${record.date}</td>
        <td><span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${statusStyle}">${record.status}</span></td>
      </tr>`;
  });
}

function renderEmployeesTable() {
  const tableBody = document.getElementById("employees-live-table");
  const badge = document.getElementById("emp-count-badge");
  if (!tableBody) return;
  const emps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
  if (badge) badge.innerText = emps.length;
  tableBody.innerHTML = emps.length === 0 ? `<tr><td colspan="4" class="py-4 text-center text-gray-400">لا يوجد موظفون.</td></tr>` : "";

  emps.forEach(emp => {
    tableBody.innerHTML += `
      <tr class="border-b border-gray-100">
        <td class="py-3 font-bold">${emp.name}</td><td class="font-mono">${emp.iqama}</td>
        <td><span class="px-2 py-0.5 bg-blue-50 text-[#0c2d6e] rounded-md font-bold">${emp.job}</span></td>
        <td class="text-center"><button onclick="deleteEmployee(${emp.id})" class="text-red-500 hover:underline">حذف</button></td>
      </tr>`;
  });
}

function deleteEmployee(id) {
  let emps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
  emps = emps.filter(e => e.id !== id);
  localStorage.setItem("five_caravans_employees", JSON.stringify(emps));
  renderEmployeesTable();
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = "login.html";
}
