<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>نظام إدارة الموارد - مؤسسة القوافل الخمسة</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Almarai', sans-serif;
    }
    .section-hidden {
      display: none !important;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-800">

  <div class="flex h-screen overflow-hidden">

    <div class="w-64 bg-[#0c2d6e] text-white flex flex-col shadow-xl z-20 transition-all duration-300">
      <div class="p-5 bg-[#092252] flex items-center gap-3 border-b border-blue-900/50">
        <span class="text-2xl">🚚</span>
        <div>
          <h2 class="font-bold text-base tracking-wide">القوافل الخمسة</h2>
          <p class="text-xs text-blue-300">للخدمات اللوجستية</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <button onclick="switchSection('dashboard')" id="btn-dashboard" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-white/10 text-white">
          <span>📊</span> لوحة التحكم العامة
        </button>
        
        <button onclick="switchSection('employees')" id="btn-employees" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-blue-100 hover:bg-white/5">
          <span>👥</span> سجلات الموظفين
        </button>
        
        <button onclick="switchSection('visas')" id="btn-visas" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-blue-100 hover:bg-white/5">
          <span>📄</span> طلبات التعديل (قوى)
        </button>

        <button onclick="switchSection('loans')" id="btn-loans" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-blue-100 hover:bg-white/5">
          <span>💰</span> سجلات السُلف المالية
        </button>
      </nav>

      <div class="p-4 border-t border-blue-900/50">
        <button onclick="logout()" class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
          <span>🚪</span> تسجيل الخروج من النظام
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col overflow-y-auto bg-gray-50">
      
      <div id="sec-dashboard" class="p-6 space-y-6">
        <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 class="text-2xl font-bold text-[#0c2d6e]">لوحة التحكم العامة</h1>
            <p class="text-gray-400 text-xs mt-1">شاشات الإدخال والترحيل الفوري للعمليات الحية.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h3 class="text-sm font-bold text-[#0c2d6e] mb-4 pb-2 border-b">📥 شاشة إدخال الحركات</h3>
            <form id="dashboard-input-form" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">اسم الموظف / السائق</label>
                <input type="text" id="dashboard-emp-name" required placeholder="مثال: أحمد ناصر" class="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0c2d6e]">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">نوع الإجراء</label>
                <select id="dashboard-action-type" class="w-full px-3 py-2 border rounded-xl text-xs bg-white outline-none">
                  <option value="طلب سُلفة مالية">💰 طلب سُلفة مالية</option>
                  <option value="تحديث مهنة بقوى">📄 تحديث مهنة بقوى</option>
                  <option value="تجديد رخصة قيادة">🪪 تجديد رخصة قيادة</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">الحالة</label>
                <select id="dashboard-status" class="w-full px-3 py-2 border rounded-xl text-xs bg-white outline-none">
                  <option value="تحت المراجعة">⏳ تحت المراجعة</option>
                  <option value="تمت الموافقة">✅ تمت الموافقة</option>
                </select>
              </div>
              <button type="submit" class="w-full bg-[#0c2d6e] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#092252] transition-all">ترحيل البيانات وحفظها 🚀</button>
            </form>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div class="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 class="text-sm font-bold text-gray-700">🖥️ شاشة العرض المباشر للعمليات</h3>
              <button onclick="clearDashboardData()" class="text-[10px] text-red-500 font-bold hover:underline">مسح السجل</button>
            </div>
            <div class="overflow-x-auto text-xs">
              <table class="w-full text-right">
                <thead>
                  <tr class="text-gray-400 border-b pb-2 font-bold">
                    <th class="pb-2">الموظف</th>
                    <th class="pb-2">نوع الإجراء</th>
                    <th class="pb-2">التاريخ والوقت</th>
                    <th class="pb-2">حالة النظام</th>
                  </tr>
                </thead>
                <tbody id="dashboard-live-table" class="divide-y divide-gray-50 text-gray-600"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="sec-employees" class="p-6 space-y-6 section-hidden">
        <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 class="text-2xl font-bold text-[#0c2d6e]">سجلات الموظفين والسائقين</h1>
            <p class="text-gray-400 text-xs mt-1">إضافة، استعراض، وحذف ملفات الموظفين الحالية في المنشأة.</p>
          </div>
          <span class="text-xs bg-blue-100 text-[#0c2d6e] font-bold px-3 py-1.5 rounded-full">المسجلين: <span id="emp-count-badge">0</span></span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h3 class="text-sm font-bold text-[#0c2d6e] mb-4 pb-2 border-b">👤 بطاقة إدخال موظف</h3>
            <form id="employee-input-form" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">اسم الموظف الثلاثي</label>
                <input type="text" id="emp-fullname" required placeholder="محمد عبد الله" class="w-full px-3 py-2 border rounded-xl text-xs outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">رقم الإقامة / الهوية</label>
                <input type="number" id="emp-id-number" required placeholder="2xxxxxxxx" class="w-full px-3 py-2 border rounded-xl text-xs outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">المسمى الوظيفي</label>
                <select id="emp-job" class="w-full px-3 py-2 border rounded-xl text-xs bg-white outline-none">
                  <option value="سائق شاحنة">سائق شاحنة</option>
                  <option value="سائق دينا">سائق دينا</option>
                  <option value="إداري">إداري</option>
                </select>
              </div>
              <button type="submit" class="w-full bg-[#0c2d6e] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#092252] transition-all">إضافة للسجلات 🚀</button>
            </form>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div class="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 class="text-sm font-bold text-gray-700">📋 قاعدة البيانات النشطة للموظفين</h3>
              <button onclick="clearEmployeesData()" class="text-[10px] text-red-500 font-bold hover:underline">مسح الكل</button>
            </div>
            <div class="overflow-x-auto text-xs">
              <table class="w-full text-right">
                <thead>
                  <tr class="text-gray-400 border-b pb-2 font-bold">
                    <th class="pb-2">الاسم</th>
                    <th class="pb-2">رقم الإقامة</th>
                    <th class="pb-2">الوظيفة</th>
                    <th class="pb-2 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody id="employees-live-table" class="divide-y divide-gray-50 text-gray-600"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="sec-visas" class="p-6 space-y-6 section-hidden">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 class="text-2xl font-bold text-[#0c2d6e]">طلبات تعديل المهن والوظائف (منصة قوى)</h1>
          <p class="text-gray-400 text-xs mt-1">قسم إدارة طلبات تعديل المهن المعلقة والمكتملة.</p>
        </div>
      </div>

      <div id="sec-loans" class="p-6 space-y-6 section-hidden">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 class="text-2xl font-bold text-[#0c2d6e]">سجلات ومتابعة السُلف المالية</h1>
          <p class="text-gray-400 text-xs mt-1">حصر وتدقيق المبالغ المالية والسلف الخاصة بجميع منسوبي المنشأة.</p>
        </div>
      </div>

    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
