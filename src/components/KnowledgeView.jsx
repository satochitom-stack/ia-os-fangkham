import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  FileText,
  Copy,
  Check,
  FolderOpen,
  ExternalLink,
  Download,
  Tag
} from 'lucide-react';

export default function KnowledgeView({
  knowledgeBase,
  orgProfile
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'หนังสือสั่งการ (ว)', label: 'หนังสือสั่งการ (ว)' },
    { id: 'กฎหมายหลัก', label: 'พ.ร.บ. / กฎหมายหลัก' },
    { id: 'ระเบียบ มท.', label: 'ระเบียบ มท.' },
  ];

  const filteredItems = knowledgeBase.filter((item) => {
    const matchCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>คลังระเบียบ กฎหมาย และหนังสือสั่งการ (Knowledge Base)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            สืบค้นข้อระเบียบและแนวทางปฏิบัติงานตรวจสอบภายใน
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            รวบรวมจากโฟลเดอร์ <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-700 dark:text-blue-400">D:\งานตรวจสอบภายใน\เอกสารความรู้-เอกสารตัวอย่าง</code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="พิมพ์ค้นหา เช่น ว 119, ยืมเงิน, ค่าเช่าบ้าน, พ.ร.บ. จัดซื้อจัดจ้าง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-xs bg-slate-50/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleCopy(item.id, `${item.title} - ${item.topic}`)}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                    title="คัดลอกชื่อหนังสือ"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {item.title}
                </h3>
                <div className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  เรื่อง: {item.topic}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 gap-2">
                <span className="flex items-center text-slate-500 dark:text-slate-400 font-mono truncate max-w-[200px]" title={item.fileRef}>
                  <FolderOpen className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                  {item.fileRef}
                </span>

                {item.fileUrl ? (
                  <span className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                      title="เปิด/ดาวน์โหลดไฟล์"
                    >
                      <Download className="w-3.5 h-3.5" />
                      เปิดไฟล์
                    </a>
                    {item.fileUrl2 && (
                      <a
                        href={item.fileUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                        title="เปิด/ดาวน์โหลดไฟล์ที่ 2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        ไฟล์ 2
                      </a>
                    )}
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0" title="ยังไม่มีไฟล์แนบในระบบ เป็นเพียงชื่ออ้างอิงเอกสาร">
                    ไม่มีไฟล์แนบในระบบ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">ไม่พบระเบียบที่ค้นหา</div>
          <div className="text-xs">ลองค้นหาด้วยคำสำคัญอื่น เช่น ว 119, ค่าเช่าบ้าน, ยืมเงิน</div>
        </div>
      )}
    </div>
  );
}
