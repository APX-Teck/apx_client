import React from 'react';
import { Metadata } from 'next';
import { ProposalLetterEditorLoader } from '@/components/admin/proposal-letter/ProposalLetterEditorLoader';

export const metadata: Metadata = {
  title: 'Proposal Letter | APXTeck Admin',
  description: 'Compose client proposal letters on the APXTECK letterhead.',
};

export default function ProposalLetterPage() {
  return <ProposalLetterEditorLoader />;
}
