'use client';

import { useState } from 'react';
import { Package, CheckCircle2, Clock, AlertCircle, Upload } from 'lucide-react';

export interface ReturnRequest {
  id: string;
  orderId: string;
  items: Array<{ id: string; name: string; quantity: number; reason: string }>;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'shipped-back' | 'refunded';
  refundAmount: number;
  refundMethod: 'original-payment' | 'store-credit' | 'gift-card';
  createdAt: Date;
  approvedAt?: Date;
  refundedAt?: Date;
  returnTrackingNumber?: string;
  evidence?: string[];
}

const returnReasons = [
  'Defective/Damaged',
  'Not as described',
  'Wrong item received',
  'Changed mind',
  'Better price found',
  'No longer needed',
  'Other',
];

/**
 * Return Request Form Component
 */
export function ReturnRequestForm({
  orderId,
  items,
  onSubmit,
}: {
  orderId: string;
  items: Array<{ id: string; name: string; price: number }>;
  onSubmit?: (request: Omit<ReturnRequest, 'id' | 'createdAt'>) => void;
}) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [refundMethod, setRefundMethod] = useState<ReturnRequest['refundMethod']>('original-payment');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedItemsData = items
        .filter((item) => selectedItems.has(item.id))
        .map((item) => ({
          ...item,
          quantity: 1,
          reason: reason,
        }));

      const refundAmount = selectedItemsData.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );

      const returnRequest: Omit<ReturnRequest, 'id' | 'createdAt'> = {
        orderId,
        items: selectedItemsData,
        reason,
        description,
        status: 'pending',
        refundAmount,
        refundMethod,
        evidence: uploadedFiles.map((f) => f.name),
      };

      // Submit to API
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(returnRequest),
      });

      if (response.ok) {
        setSuccess(true);
        setSelectedItems(new Set());
        setReason('');
        setDescription('');
        setUploadedFiles([]);
      }

      onSubmit?.(returnRequest);
    } catch (error) {
      console.error('Failed to submit return request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle2 className="text-green-600 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Return Request Submitted
        </h3>
        <p className="text-gray-600">
          Your return request has been submitted. We&apos;ll review it and contact you
          within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Items Selection */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">Select Items to Return</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <label key={item.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => handleItemToggle(item.id)}
                className="w-4 h-4"
              />
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>
              <p className="font-semibold text-gray-900">${item.price}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Reason for Return
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select a reason...</option>
          {returnReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Additional Details
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide any additional information..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows={4}
        />
      </div>

      {/* Evidence Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Upload Evidence (Photos/Videos)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files or click to browse
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="evidence-upload"
          />
          <label htmlFor="evidence-upload" className="text-blue-600 cursor-pointer hover:underline text-sm">
            Choose files
          </label>
          {uploadedFiles.length > 0 && (
            <div className="mt-4 text-left">
              {uploadedFiles.map((file) => (
                <p key={file.name} className="text-sm text-gray-600">
                  ✓ {file.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Refund Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Refund Method
        </label>
        <div className="space-y-2">
          {(['original-payment', 'store-credit', 'gift-card'] as const).map((method) => (
            <label key={method} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="refund-method"
                value={method}
                checked={refundMethod === method}
                onChange={(e) => setRefundMethod(e.target.value as typeof method)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-900 font-medium capitalize">
                {method.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={selectedItems.size === 0 || !reason || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? 'Submitting...' : 'Submit Return Request'}
      </button>
    </form>
  );
}

/**
 * Return Status Tracker Component
 */
export function ReturnStatusTracker({ returnRequest }: { returnRequest: ReturnRequest }) {
  const statusFlow: readonly ReturnRequest['status'][] = ['pending', 'approved', 'shipped-back', 'refunded'];
  const currentIndex = statusFlow.indexOf(returnRequest.status);

  const statusInfo: Record<ReturnRequest['status'], { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; color: string }> = {
    pending: { icon: Clock, label: 'Pending Review', color: 'yellow' },
    approved: { icon: CheckCircle2, label: 'Approved', color: 'green' },
    rejected: { icon: AlertCircle, label: 'Rejected', color: 'red' },
    'shipped-back': { icon: Package, label: 'Shipped Back', color: 'blue' },
    refunded: { icon: CheckCircle2, label: 'Refunded', color: 'green' },
  };

  const info = statusInfo[returnRequest.status];
  const Icon = info.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`bg-${info.color}-100 p-3 rounded-full`}>
          <Icon className={`text-${info.color}-600`} size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Return #{returnRequest.id.substring(0, 8)}</h3>
          <p className={`text-${info.color}-600 font-semibold capitalize`}>{info.label}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-4">
          {statusFlow.map((status, index) => {
            const statusIcon = statusInfo[status as ReturnRequest['status']];
            const StatusIcon = statusIcon.icon;
            const isActive = index <= currentIndex;

            return (
              <div key={status} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive
                      ? `bg-${statusIcon.color}-100`
                      : 'bg-gray-100'
                  }`}
                >
                  <StatusIcon
                    size={20}
                    className={isActive ? `text-${statusIcon.color}-600` : 'text-gray-400'}
                  />
                </div>
                <p className="text-xs text-center text-gray-600 capitalize">
                  {status.replace('-', ' ')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
            style={{ width: `${(currentIndex / (statusFlow.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="font-semibold text-gray-900">{returnRequest.orderId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Refund Amount</p>
          <p className="font-semibold text-gray-900">${returnRequest.refundAmount.toFixed(2)}</p>
        </div>
        {returnRequest.returnTrackingNumber && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="font-semibold text-gray-900">
              {returnRequest.returnTrackingNumber}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600 mb-1">Refund Method</p>
          <p className="font-semibold text-gray-900 capitalize">
            {returnRequest.refundMethod.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">Return Reason</p>
        <p className="text-gray-900">{returnRequest.reason}</p>
        {returnRequest.description && (
          <p className="text-sm text-gray-600 mt-2">{returnRequest.description}</p>
        )}
      </div>
    </div>
  );
}
