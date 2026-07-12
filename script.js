document.addEventListener("DOMContentLoaded", function () {
  // شحن شاشات العرض بالبيانات عند الفتح الفوري للموقع
  renderDashboardTable();
  renderEmployeesTable();

  // 1. استقبال وترحيل بيانات لوحة التحكم العامة
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

  // 2. استقبال وترحيل بيانات سجلات الموظفين والسائقين
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

// دالة التبديل الذكي بين صفحات السايد بار (Sidebar Navigation)
function switchSection(sectionName) {
  // إخفاء كل الأقسام أولاً
  document.getElementById("sec-dashboard").classList.add("section-hidden");
  document.getElementById("sec-employees").classList.add("section-hidden");

  // إزالة التحديد الملون من كافة الأزرار
  document.getElementById("btn-dashboard").className = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-blue-100 hover:bg-white/5";
  document.getElementById("btn-employees").className = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-blue-100 hover:bg-white/5";

  // إظهار القسم المطلوب وتلوين زره الخاص لتأكيد الاختيار
  if (sectionName === 'dashboard') {
    document.getElementById("sec-dashboard").classList.remove("section-hidden");
    document.getElementById("btn-dashboard").className = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-white/10 text-white";
  } else if (sectionName === 'employees') {
    document.getElementById("sec-employees").classList.remove("section-hidden");
    document.getElementById("btn-employees").className = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-white/10 text-white";
  }
}

// دالة رسم وعرض جدول العمليات الحية
function renderDashboardTable() {
  const tableBody = document.getElementById("dashboard-live-table");
  if (!tableBody) return;
  const records = JSON.parse(localStorage.getItem("five_caravans_main_data")) || [];
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-gray-400 italic">شاشة العرض فارغة. رحّل بيانات للبدء.</td></tr>`;
    return;
  }

  records.forEach(record => {
    let statusStyle = record.status === "تمت الموافقة" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700";
    tableBody.innerHTML += `
      <tr class="border-b border-gray-100">
        <td class="py-3 font-bold text-gray-800">${record.name}</td>
        <td class="py-3">${record.action}</td>
        <td class="py-3 text-gray-400 font-mono" dir="ltr">${record.date}</td>
        <td class="py-3"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${statusStyle}">${record.status}</span></td>
      </tr>`;
  });
}

// دالة رسم وعرض جدول الموظفين
function renderEmployeesTable() {
  const tableBody = document.getElementById("employees-live-table");
  const badge = document.getElementById("emp-count-badge");
  if (!tableBody) return;
  const emps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
  tableBody.innerHTML = "";
  if (badge) badge.innerText = emps.length;

  if (emps.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-gray-400 italic">لا يوجد موظفون مسجلون.</td></tr>`;
    return;
  }

  emps.forEach(emp => {
    tableBody.innerHTML += `
      <tr class="border-b border-gray-100">
        <td class="py-3 font-bold text-gray-800">${emp.name}</td>
        <td class="py-3 font-mono">${emp.iqama}</td>
        <td class="py-3"><span class="px-2 py-0.5 bg-blue-50 text-[#0c2d6e] rounded-md font-bold">${emp.job}</span></td>
        <td class="py-3 text-center"><button onclick="deleteEmployee(${emp.id})" class="text-red-500 hover:underline">حذف</button></td>
      </tr>`;
  });
}

function deleteEmployee(id) {
  let emps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
  emps = emps.filter(e => e.id !== id);
  localStorage.setItem("five_caravans_employees", JSON.stringify(emps));
  renderEmployeesTable();
}

function clearDashboardData() { localStorage.removeItem("five_caravans_main_data"); renderDashboardTable(); }
function clearEmployeesData() { localStorage.removeItem("five_caravans_employees"); renderEmployeesTable(); }
function logout() { localStorage.removeItem('isLoggedIn'); window.location.href = "login.html"; }
