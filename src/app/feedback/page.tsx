'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Bug, Lightbulb, Star, HelpCircle } from 'lucide-react';

// Replace with your Formspree form ID after signing up at formspree.io
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjrqdkk';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', icon: Bug, description: 'Something is broken or not working' },
  { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, description: 'Ideas for new features or improvements' },
  { value: 'content', label: 'Content Issue', icon: AlertCircle, description: 'Incorrect Arabic, translation, or exercise' },
  { value: 'general', label: 'General Feedback', icon: Star, description: 'Anything else on your mind' },
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function FeedbackPage() {
  const [type, setType] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, type, message }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setType('general');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Found a bug, have a suggestion, or spotted an error? Let us know.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-10 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Thank you!</h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been received. We appreciate you taking the time to help improve the app.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Send more feedback
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Feedback type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  What kind of feedback is this?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FEEDBACK_TYPES.map(({ value, label, icon: Icon, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setType(value)}
                      className={`text-left rounded-xl border-2 p-3 transition-all ${
                        type === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${type === value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${type === value ? 'text-primary' : 'text-foreground'}`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">{description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Name <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="for follow-up replies"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  placeholder={
                    type === 'bug'
                      ? 'Describe what happened and what you expected to happen...'
                      : type === 'suggestion'
                      ? 'Describe your idea or improvement...'
                      : type === 'content'
                      ? 'Which lesson or word has the issue? What is incorrect?'
                      : 'Share your thoughts...'
                  }
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Failed to send. Please try again or email directly at{' '}
                  <a href="mailto:dilmuratd@gmail.com" className="underline font-medium">
                    dilmuratd@gmail.com
                  </a>
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Sent directly to the course instructor
                </p>
                <button
                  type="submit"
                  disabled={status === 'submitting' || !message.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Feedback
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
