// تشغيل الكود بمجرد تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", function () {
  // تفعيل شاشة العرض لأول مرة لقراءة البيانات المحفوظة
  renderDashboardTable();

  // الاستماع لنموذج الإدخال عند الضغط على زر الترحيل
  const inputForm = document.getElementById("dashboard-input-form");
  if (inputForm) {
    inputForm.addEventListener("submit", function (e) {
      e.preventDefault(); // منع إعادة تحميل الصفحة الحالية

      // جلب القيم من شاشات الإدخال
      const empName = document.getElementById("dashboard-emp-name").value.trim();
      const actionType = document.getElementById("dashboard-action-type").value;
      const status = document.getElementById("dashboard-status").value;
      const currentDate = new Date().toLocaleDateString('ar-SA');

      // إنشاء كائن الإدخال الجديد لبيانات المنشأة
      const newRecord = {
        name: empName,
        action: actionType,
        date: currentDate,
        status: status
      };

      // جلب البيانات القديمة من الذاكرة أو إنشاء مصفوفة جديدة إذا كانت فارغة
      let currentRecords = JSON.parse(localStorage.getItem("five_caravans_data")) || [];
      
      // إضافة السجل الجديد في أعلى القائمة (أحدث الإدخالات أولاً)
      currentRecords.unshift(newRecord);

      // حفظ التعديلات في ذاكرة المتصفح للشركات الكبرى
      localStorage.setItem("five_caravans_data", JSON.stringify(currentRecords));

      // إعادة تحديث شاشة العرض أمام عينك فوراً
      renderDashboardTable();

      // مسح خانة الاسم لتجهيزها للإدخال التالي
      document.getElementById("dashboard-emp-name").value = "";
    });
  }
});

// دالة (Function) لتحديث شاشة العرض وجدول البيانات
function renderDashboardTable() {
  const tableBody = document.getElementById("dashboard-live-table");
  if (!tableBody) return;

  // جلب البيانات المخزنة
  const records = JSON.parse(localStorage.getItem("five_caravans_data")) || [];

  // تنظيف الجدول قبل إعادة الرسم
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="py-8 text-center text-gray-400 italic">لا توجد سجلات مدخلة حالياً. استخدم شاشة الإدخال على اليمين للبدء.</td>
      </tr>
    `;
    return;
  }

  // رسم السطور بناءً على المدخلات الحية
  records.forEach(record => {
    let statusClass = "bg-amber-100 text-amber-700"; // افتراضي تحت المراجعة
    if (record.status === "تمت الموافقة") statusClass = "bg-green-100 text-green-700";
    if (record.status === "منتهية / مرفوضة") statusClass = "bg-red-100 text-red-700";

    const row = `
      <tr class="hover:bg-gray-50/50 transition-colors">
        <td class="py-3.5 font-bold text-gray-800">${record.name}</td>
        <td class="py-3.5 text-gray-700">${record.action}</td>
        <td class="py-3.5 text-gray-500" dir="ltr">${record.date}</td>
        <td class="py-3.5">
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${statusClass}">${record.status}</span>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// دالة لتنظيف الذاكرة ومسح جدول العرض بالكامل
function clearDashboardData() {
  if (confirm("هل أنت متأكد من رغبتك في مسح كافة السجلات المدخلة في لوحة التحكم؟")) {
    localStorage.removeItem("five_caravans_data");
    renderDashboardTable();
  }
}
