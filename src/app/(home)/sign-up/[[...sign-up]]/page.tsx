"use client";

import { SignUp } from '@clerk/nextjs'

import { useCurrentTheme } from '@/hooks/use-current-theme';
import { dark } from '@clerk/themes';

const Page = () => {
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className='space-y-6 pt-[16vh] 2xl:pt-48'>
        <div className='flex flex-col items-center'>
          <SignUp
            appearance={{
              theme: useCurrentTheme() === "dark" ? dark : undefined,
              elements: {
                cardBox: "border! shadown-none! rounded-lg!"
              }
            }}
          />
        </div>
      </section>
    </div>
  );
}

export default Page;