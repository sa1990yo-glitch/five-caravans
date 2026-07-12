document.addEventListener("DOMContentLoaded", function () {
  // تشغيل شاشة العرض لقراءة أي بيانات قديمة محفوظة
  renderDashboardTable();

  // تفعيل الاستماع لشاشة الإدخال
  const inputForm = document.getElementById("dashboard-input-form");
  if (inputForm) {
    inputForm.addEventListener("submit", function (e) {
      e.preventDefault(); // منع الصفحة من تحديث نفسها وضياع البيانات

      // جلب القيم من شاشات الإدخال
      const empName = document.getElementById("dashboard-emp-name").value.trim();
      const actionType = document.getElementById("dashboard-action-type").value;
      const status = document.getElementById("dashboard-status").value;
      
      // تسجيل التاريخ والوقت الفعلي الحالي للعملية
      const currentDateTime = new Date().toLocaleString('ar-SA', { hour12: true });

      // تجميع البيانات في سجل موحد
      const newRecord = {
        name: empName,
        action: actionType,
        date: currentDateTime,
        status: status
      };

      // جلب قاعدة البيانات الحالية من المتصفح أو إنشاء واحدة جديدة
      let currentRecords = JSON.parse(localStorage.getItem("five_caravans_main_data")) || [];
      
      // إدراج السجل الجديد في بداية القائمة لتظهر الأحدث أولاً
      currentRecords.unshift(newRecord);

      // حفظ السجل الجديد في المتصفح لضمان عدم ضياعه حتى بعد الإغلاق
      localStorage.setItem("five_caravans_main_data", JSON.stringify(currentRecords));

      // تحديث شاشة العرض فوراً أمامك
      renderDashboardTable();

      // تصفير خانة الاسم لتهيئتها للموظف التالي
      document.getElementById("dashboard-emp-name").value = "";
    });
  }
});

// دالة معالجة ورسم البيانات داخل شاشة العرض
function renderDashboardTable() {
  const tableBody = document.getElementById("dashboard-live-table");
  if (!tableBody) return;

  const records = JSON.parse(localStorage.getItem("five_caravans_main_data")) || [];
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="py-8 text-center text-gray-400 italic">شاشة العرض فارغة حالياً. يرجى ترحيل بيانات من شاشة الإدخال المقابلة.</td>
      </tr>
    `;
    return;
  }

  // فرز السجلات وبناء السطور برمجياً مع الألوان المناسبة لكل حالة
  records.forEach(record => {
    let statusStyle = "bg-amber-100 text-amber-700"; // تحت المراجعة
    if (record.status === "تمت الموافقة") statusStyle = "bg-green-100 text-green-700";
    if (record.status === "مرفوضة / منتهية") statusStyle = "bg-red-100 text-red-700";

    const row = `
      <tr class="hover:bg-gray-50/50 transition-all border-b border-gray-100">
        <td class="py-3.5 font-bold text-gray-800">${record.name}</td>
        <td class="py-3.5 text-gray-600">${record.action}</td>
        <td class="py-3.5 text-gray-400" dir="ltr">${record.date}</td>
        <td class="py-3.5">
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${statusStyle}">${record.status}</span>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// دالة حذف البيانات بالكامل من شاشة العرض
function clearDashboardData() {
  if (confirm("هل أنت متأكد من رغبتك في تفريغ شاشة العرض ومسح كافة البيانات؟")) {
    localStorage.removeItem("five_caravans_main_data");
    renderDashboardTable();
  }
}
