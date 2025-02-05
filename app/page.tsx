import Link from 'next/link';
import { FileText, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Application Management System
          </h1>
          <p className="text-muted-foreground mb-12">
            Submit and manage your applications with ease
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/form"
              className=" relative flex flex-col items-center p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Submit Application</h2>
              <p className="text-sm text-muted-foreground text-center">
                Fill out your application details and submit for review
              </p>
            </Link>

            <Link 
              href="/data"
              className=" relative flex flex-col items-center p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 p-3">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">View Applications</h2>
              <p className="text-sm text-muted-foreground text-center">
                Browse and manage all submitted applications
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}