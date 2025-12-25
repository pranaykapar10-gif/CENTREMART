'use client';

import AdminLayout from '@/components/AdminLayout';
import { Mail, Eye, Edit2, Save, X, Plus } from 'lucide-react';
import { useState } from 'react';

interface EmailTemplate {
  id: number;
  name: string;
  slug: string;
  subject: string;
  description: string;
  variables: string[];
  previewText: string;
  isActive: boolean;
  lastModified: string;
  preview?: string;
}

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: 'Order Confirmation',
      slug: 'order-confirmation',
      subject: 'Your Order #{{order_id}} Has Been Confirmed',
      description: 'Sent immediately after order placement',
      variables: ['{{customer_name}}', '{{order_id}}', '{{order_total}}', '{{order_date}}', '{{items_count}}'],
      previewText: 'Thank you for your order! Here are the details...',
      isActive: true,
      lastModified: '2024-01-15',
      preview: 'order-confirmation',
    },
    {
      id: 2,
      name: 'Shipment Notification',
      slug: 'shipment-notification',
      subject: 'Your Order #{{order_id}} Has Been Shipped 🚚',
      description: 'Sent when order is dispatched',
      variables: ['{{customer_name}}', '{{order_id}}', '{{tracking_number}}', '{{carrier}}', '{{estimated_delivery}}'],
      previewText: 'Great news! Your order is on the way...',
      isActive: true,
      lastModified: '2024-01-10',
      preview: 'shipment-notification',
    },
    {
      id: 3,
      name: 'Delivery Confirmation',
      slug: 'delivery-confirmation',
      subject: 'Your Order #{{order_id}} Has Been Delivered ✅',
      description: 'Sent upon successful delivery',
      variables: ['{{customer_name}}', '{{order_id}}', '{{delivery_date}}', '{{tracking_number}}'],
      previewText: 'Your package has been delivered successfully...',
      isActive: true,
      lastModified: '2024-01-05',
      preview: 'delivery-confirmation',
    },
    {
      id: 4,
      name: 'Review Request',
      slug: 'review-request',
      subject: 'Share Your Experience with {{product_name}} 🌟',
      description: 'Sent 5 days after delivery',
      variables: ['{{customer_name}}', '{{product_name}}', '{{product_url}}', '{{review_url}}'],
      previewText: 'We&apos;d love to hear what you think...',
      isActive: true,
      lastModified: '2024-01-12',
      preview: 'review-request',
    },
    {
      id: 5,
      name: 'Abandoned Cart',
      slug: 'abandoned-cart',
      subject: 'You Left {{items_count}} Items in Your Cart 🛒',
      description: 'Sent 24 hours after cart abandonment',
      variables: ['{{customer_name}}', '{{items_count}}', '{{cart_value}}', '{{recovery_link}}'],
      previewText: 'Complete your purchase and get 10% off...',
      isActive: true,
      lastModified: '2024-01-08',
      preview: 'abandoned-cart',
    },
    {
      id: 6,
      name: 'Password Reset',
      slug: 'password-reset',
      subject: 'Reset Your Password',
      description: 'Sent when user requests password reset',
      variables: ['{{customer_name}}', '{{reset_link}}', '{{expiry_time}}'],
      previewText: 'Click the link below to reset your password...',
      isActive: true,
      lastModified: '2024-01-03',
      preview: 'password-reset',
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState<number | null>(null);

  const handleEdit = (template: EmailTemplate) => {
    setEditingId(template.id);
    setEditingTemplate({ ...template });
  };

  const handleSave = () => {
    if (editingTemplate) {
      setTemplates(templates.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)));
      setEditingId(null);
      setEditingTemplate(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingTemplate(null);
  };

  const handleSendTest = (id: number) => {
    alert(`Test email from template #${id} would be sent to your email address`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Email Templates</h1>
            <p className="text-gray-600 mt-1">Manage transactional and marketing email templates</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">
            <Plus size={20} /> Create Template
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Templates</p>
            <p className="text-3xl font-black text-gray-900">{templates.length}</p>
          </div>

          <div className="bg-green-50 rounded-2xl border border-green-200 p-6 shadow-sm">
            <p className="text-sm text-green-700 font-semibold mb-1">Active</p>
            <p className="text-3xl font-black text-green-600">{templates.filter((t) => t.isActive).length}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Inactive</p>
            <p className="text-3xl font-black text-gray-700">{templates.filter((t) => !t.isActive).length}</p>
          </div>
        </div>

        {/* Templates List */}
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id}>
              {editingId === template.id && editingTemplate ? (
                // Edit Mode
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                    <Mail size={24} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{editingTemplate.name}</h3>
                    <button
                      onClick={handleCancel}
                      className="p-2 hover:bg-gray-100 rounded transition"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
                      <input
                        type="text"
                        value={editingTemplate.subject}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Available variables: {template.variables.join(', ')}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Preview Text</label>
                      <textarea
                        value={editingTemplate.previewText}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate, previewText: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={editingTemplate.isActive}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <label className="text-sm font-semibold text-gray-700">Active</label>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <Save size={18} /> Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail size={20} className="text-blue-600 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {template.isActive ? '✓ Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                      <div className="space-y-2 mb-3">
                        <p className="text-xs text-gray-500 font-semibold">Subject:</p>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded border border-gray-200">
                          {template.subject}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 font-semibold">Variables:</span>
                        {template.variables.map((v, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-mono border border-blue-200"
                          >
                            {v}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Last modified: {new Date(template.lastModified).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPreview(showPreview === template.id ? null : template.id)}
                        className="p-2 hover:bg-gray-100 rounded transition text-gray-600"
                        title="Preview"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="p-2 hover:bg-gray-100 rounded transition text-gray-600"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {showPreview === template.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Preview:</p>
                          <div className="bg-white border border-gray-200 rounded p-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-900">📧 {template.subject}</p>
                            <p className="text-sm text-gray-700">{template.previewText}</p>

                            {/* Mock Email Preview Content */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <pre className="space-y-2 text-xs text-gray-700 bg-gray-50 p-3 rounded overflow-auto whitespace-pre-wrap">
                                {template.slug === 'order-confirmation' &&
                                  `Hi {{customer_name}},

Thank you for your order! We're excited to prepare it for shipment.

Order Details:
- Order ID: {{order_id}}
- Total: {{order_total}}
- Items: {{items_count}}`}
                                {template.slug === 'shipment-notification' &&
                                  `Hi {{customer_name}},

Great news! Your order is on the way.

Tracking Info:
- Carrier: {{carrier}}
- Tracking: {{tracking_number}}
- Est. Delivery: {{estimated_delivery}}`}
                                {template.slug === 'review-request' &&
                                  `Hi {{customer_name}},

Your {{product_name}} should have arrived. How do you like it?

Share your experience and help other customers make informed decisions.`}
                                {template.slug === 'abandoned-cart' &&
                                  `Hi {{customer_name}},

You have {{items_count}} items waiting in your cart worth {{cart_value}}.

Complete your purchase now and get 10% off your next order!`}
                                {template.slug === 'password-reset' &&
                                  `Hi {{customer_name}},

Click the link below to reset your password. This link expires in {{expiry_time}}.`}
                              </pre>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSendTest(template.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                          📧 Send Test Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Email Variable Reference */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📚 Email Variable Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              { var: '{{customer_name}}', desc: 'Full name of customer' },
              { var: '{{order_id}}', desc: 'Unique order identifier' },
              { var: '{{order_total}}', desc: 'Total order amount formatted' },
              { var: '{{order_date}}', desc: 'Date order was placed' },
              { var: '{{items_count}}', desc: 'Number of items in order' },
              { var: '{{tracking_number}}', desc: 'Shipping tracking number' },
              { var: '{{carrier}}', desc: 'Shipping carrier name' },
              { var: '{{estimated_delivery}}', desc: 'Expected delivery date' },
              { var: '{{delivery_date}}', desc: 'Actual delivery date' },
              { var: '{{product_name}}', desc: 'Name of the product' },
              { var: '{{product_url}}', desc: 'Link to product page' },
              { var: '{{review_url}}', desc: 'Link to review submission' },
              { var: '{{cart_value}}', desc: 'Total value in abandoned cart' },
              { var: '{{recovery_link}}', desc: 'Link to complete cart purchase' },
              { var: '{{reset_link}}', desc: 'Password reset link' },
              { var: '{{expiry_time}}', desc: 'Time until link expires' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="font-mono text-blue-700 font-semibold">{item.var}</p>
                <p className="text-gray-700 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
