// أضف هذا الجزء داخل دالة الاستماع الرئيسية (DOMContentLoaded) أو في نهاية الملف:

document.addEventListener("DOMContentLoaded", function () {
  // تشغيل شاشات العرض فور فتح الصفحة
  renderDashboardTable();
  renderEmployeesTable();

  // تفعيل الاستماع لشاشة إدخال الموظفين
  const empForm = document.getElementById("employee-input-form");
  if (empForm) {
    empForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // جلب قيم المدخلات
      const fullName = document.getElementById("emp-fullname").value.trim();
      const idNumber = document.getElementById("emp-id-number").value.trim();
      const jobTitle = document.getElementById("emp-job").value;
      const phoneNum = document.getElementById("emp-phone").value.trim() || "غير مسجل";

      const newEmp = {
        id: Date.now(), // معرف فريد لكل موظف
        name: fullName,
        iqama: idNumber,
        job: jobTitle,
        phone: phoneNum
      };

      let currentEmps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
      currentEmps.unshift(newEmp);
      localStorage.setItem("five_caravans_employees", JSON.stringify(currentEmps));

      // إعادة رسم الجدول وتصفير الخانات
      renderEmployeesTable();
      empForm.reset();
    });
  }
});

// دالة رسم جدول عرض الموظفين
function renderEmployeesTable() {
  const tableBody = document.getElementById("employees-live-table");
  const badge = document.getElementById("emp-count-badge");
  if (!tableBody) return;

  const emps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
  tableBody.innerHTML = "";
  if (badge) badge.innerText = emps.length;

  if (emps.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-gray-400 italic">قاعدة البيانات فارغة حالياً. أضف موظفاً من الشاشة الجانبية.</td>
      </tr>
    `;
    return;
  }

  emps.forEach(emp => {
    const row = `
      <tr class="hover:bg-gray-50/50 transition-all border-b border-gray-100">
        <td class="py-3.5 font-bold text-gray-800">${emp.name}</td>
        <td class="py-3.5 text-gray-600 font-mono">${emp.iqama}</td>
        <td class="py-3.5 text-gray-700">
          <span class="px-2 py-0.5 bg-blue-50 text-[#0c2d6e] rounded-md text-xs font-medium">${emp.job}</span>
        </td>
        <td class="py-3.5 text-gray-500 font-mono">${emp.phone}</td>
        <td class="py-3.5 text-center">
          <button onclick="deleteEmployee(${emp.id})" class="text-red-500 hover:text-red-700 font-bold">حذف 🗑️</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// دالة حذف موظف معين
function deleteEmployee(id) {
  if (confirm("هل أنت متأكد من حذف هذا الموظف نهائياً من السجلات؟")) {
    let emps = JSON.parse(localStorage.getItem("five_caravans_employees")) || [];
    emps = emps.filter(e => e.id !== id);
    localStorage.setItem("five_caravans_employees", JSON.stringify(emps));
    renderEmployeesTable();
  }
}

// دالة مسح السجل بالكامل
function clearEmployeesData() {
  if (confirm("تحذير: هل تريد مسح قاعدة بيانات الموظفين بالكامل؟")) {
    localStorage.removeItem("five_caravans_employees");
    renderEmployeesTable();
  }
}
