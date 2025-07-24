import React, { useState, useRef } from 'react';
import { Calendar, Download, Heart, FileText, Eye, X, Edit3, Share } from 'lucide-react';

const CoupleContract = () => {
  const [contractData, setContractData] = useState({
    person1: {
      name: '',
      address: '',
      birthNumber: '',
      signature: '',
      drawnSignature: ''
    },
    person2: {
      name: '',
      address: '',
      birthNumber: '',
      signature: '',
      drawnSignature: ''
    },
    specialTerms: [
      '술은 일주일에 한 번 이상 마시지 않으며, 꼭 사전에 연락을 미리 해줄 것.',
      '친구를 만날 때에도 3시간에 한 번 이상, 자리를 옮길 때에는 꼭 연락을 해줄 것.',
      '이성친구와 단둘이 만나지 않을것.'
    ],
    customTerms: '',
    date: new Date().toLocaleDateString('ko-KR')
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [currentSigner, setCurrentSigner] = useState('');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleInputChange = (person, field, value) => {
    setContractData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }));
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...contractData.specialTerms];
    newTerms[index] = value;
    setContractData(prev => ({
      ...prev,
      specialTerms: newTerms
    }));
  };

  const addTerm = () => {
    setContractData(prev => ({
      ...prev,
      specialTerms: [...prev.specialTerms, '']
    }));
  };

  const removeTerm = (index) => {
    const newTerms = contractData.specialTerms.filter((_, i) => i !== index);
    setContractData(prev => ({
      ...prev,
      specialTerms: newTerms
    }));
  };

  const exportContract = () => {
    setShowShareSheet(true);
  };

  const openSignature = (person) => {
    setCurrentSigner(person);
    setShowSignature(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    // 기존 텍스트 서명과 함께 저장
    const currentTextSignature = contractData[currentSigner].signature;
    const textPart = currentTextSignature && !currentTextSignature.startsWith('data:') ? currentTextSignature : '';
    setContractData(prev => ({
      ...prev,
      [currentSigner]: {
        ...prev[currentSigner],
        signature: textPart,
        drawnSignature: dataURL
      }
    }));
    setShowSignature(false);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const shareOptions = [
    { icon: '📋', name: '복사', action: () => alert('클립보드에 복사되었습니다') },
    { icon: '📁', name: '파일 저장', action: () => alert('파일로 저장되었습니다') },
    { icon: '📤', name: '공유하기', action: () => alert('네이티브 공유 기능') },
    { icon: '💬', name: '메시지', action: () => alert('메시지로 공유') },
    { icon: '💛', name: '카카오톡', action: () => alert('카카오톡으로 공유') },
    { icon: '📷', name: '인스타그램', action: () => alert('인스타그램으로 공유') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="text-pink-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">커플 각서 쓰기</h1>
            <Heart className="text-pink-500" size={32} />
          </div>
          <p className="text-gray-600">우리만의 약속을 만들고 저장해보세요</p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText size={20} />
            정보 입력
          </h2>

          {/* 당사자 정보 */}
          <div className="space-y-6">
            {['person1', 'person2'].map((person, idx) => (
              <div key={person} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-3 text-gray-700">
                  {idx === 0 ? '갑' : '을'} (당사자 {idx + 1})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={contractData[person].name}
                      onChange={(e) => handleInputChange(person, 'name', e.target.value)}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주민등록번호 앞자리
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={contractData[person].birthNumber}
                      onChange={(e) => handleInputChange(person, 'birthNumber', e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주소
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={contractData[person].address}
                      onChange={(e) => handleInputChange(person, 'address', e.target.value)}
                      placeholder="주소를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서명
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={contractData[person].signature}
                        onChange={(e) => handleInputChange(person, 'signature', e.target.value)}
                        placeholder="이름을 입력하세요"
                      />
                      <button
                        onClick={() => {
                          setCurrentSigner(person);
                          setShowSignature(true);
                        }}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Edit3 size={16} />
                        서명하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 특약 조항 */}
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-gray-700">특약 조항</h3>
            <div className="space-y-2">
              {contractData.specialTerms.map((term, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-sm text-gray-500 mt-2 min-w-[20px]">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={term}
                    onChange={(e) => handleTermChange(index, e.target.value)}
                    placeholder="약속 내용을 입력하세요"
                  />
                  <button
                    onClick={() => removeTerm(index)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={addTerm}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                + 약속 추가
              </button>
            </div>
          </div>

          {/* 추가 특약 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 특약사항
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={4}
              value={contractData.customTerms}
              onChange={(e) => setContractData(prev => ({ ...prev, customTerms: e.target.value }))}
              placeholder="위 중 하나라도 지켜지지 않을 시에는 갑은 을에게 교촌 허니콤보를 3회 사줄 것을 약속한다."
            />
          </div>

          {/* 액션 버튼들 */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              <Eye size={16} />
              미리보기
            </button>
            <button
              onClick={exportContract}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              <Download size={16} />
              내보내기
            </button>
          </div>
        </div>

        {/* 미리보기 팝업 */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">각서 미리보기</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="border-2 border-gray-300 p-6 bg-white text-sm leading-relaxed">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-4">각 서</h1>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <strong>갑</strong> {contractData.person1.name || '[이름]'} (생년월일: {contractData.person1.birthNumber || '[000000]'})
                    </div>
                    <div>
                      주소: {contractData.person1.address || '[주소]'}
                    </div>
                    
                    <div className="mt-4">
                      <strong>을</strong> {contractData.person2.name || '[이름]'} (생년월일: {contractData.person2.birthNumber || '[000000]'})
                    </div>
                    <div>
                      주소: {contractData.person2.address || '[주소]'}
                    </div>

                    <div className="mt-6">
                      <p>위 두 사람은 서로 사랑하는 마음으로 다음과 같이 약속하며 이를 지킬 것을 다짐한다.</p>
                    </div>

                    <div className="mt-4">
                      <strong>특약 조항:</strong>
                      <ol className="mt-2 space-y-1">
                        {contractData.specialTerms.map((term, index) => (
                          <li key={index}>
                            {index + 1}. {term || '[약속 내용]'}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {contractData.customTerms && (
                      <div className="mt-4">
                        <strong>추가 특약:</strong>
                        <p className="mt-1">{contractData.customTerms}</p>
                      </div>
                    )}

                    <div className="mt-8 pt-4 border-t">
                      <div className="text-center space-y-4">
                        <p>위 약속을 충실히 이행할 것을 서약하며 이에 서명날인한다.</p>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                          <Calendar size={16} />
                          작성일: {contractData.date}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                          <div className="text-center">
                            <div className="mb-2">갑</div>
                            <div className="border-b border-gray-300 h-12 mb-2 flex items-center justify-center gap-2">
                              {contractData.person1.signature && (
                                <span className="text-gray-800 font-medium">{contractData.person1.signature}</span>
                              )}
                              {contractData.person1.drawnSignature && (
                                <img src={contractData.person1.drawnSignature} alt="갑 서명" className="h-10 max-w-[80px] object-contain" />
                              )}
                              {!contractData.person1.signature && !contractData.person1.drawnSignature && (
                                <span className="text-gray-400">[서명]</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">(서명 및 날인)</div>
                          </div>
                          <div className="text-center">
                            <div className="mb-2">을</div>
                            <div className="border-b border-gray-300 h-12 mb-2 flex items-center justify-center gap-2">
                              {contractData.person2.signature && (
                                <span className="text-gray-800 font-medium">{contractData.person2.signature}</span>
                              )}
                              {contractData.person2.drawnSignature && (
                                <img src={contractData.person2.drawnSignature} alt="을 서명" className="h-10 max-w-[80px] object-contain" />
                              )}
                              {!contractData.person2.signature && !contractData.person2.drawnSignature && (
                                <span className="text-gray-400">[서명]</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">(서명 및 날인)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t text-center space-y-3">
                    <p className="text-xs text-gray-400">
                      본 각서는 법적 효력은 없지만, Signaling 팀이 지켜보고 있습니다.
                    </p>
                    
                    <div className="text-xs text-gray-400">
                      <span>커플들의 완벽한 캘린더, Signaling</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={() => setShowShareSheet(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  <Share size={16} />
                  공유하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 서명 팝업 */}
        {showSignature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">서명하기</h3>
                <button
                  onClick={() => setShowSignature(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">아래 영역에 손가락으로 서명해주세요</p>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="border border-gray-300 rounded-md w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent("mousedown", {
                      clientX: touch.clientX,
                      clientY: touch.clientY
                    });
                    startDrawing(mouseEvent);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent("mousemove", {
                      clientX: touch.clientX,
                      clientY: touch.clientY
                    });
                    draw(mouseEvent);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    stopDrawing();
                  }}
                />
              </div>
              
              <div className="p-4 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={clearCanvas}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  지우기
                </button>
                <button
                  onClick={saveSignature}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 공유 바텀시트 */}
        {showShareSheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-2xl w-full max-w-md animate-slide-up">
              <div className="p-4 border-b">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-center">공유하기</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {shareOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        option.action();
                        setShowShareSheet(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="text-3xl">{option.icon}</div>
                      <span className="text-sm text-gray-700">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowShareSheet(false)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoupleContract;