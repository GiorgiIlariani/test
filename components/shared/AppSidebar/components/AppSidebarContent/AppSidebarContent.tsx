import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  ShadcnSidebarContent,
  ShadcnSidebarGroup,
  ShadcnSidebarMenu,
  ShadcnSidebarMenuButton,
  ShadcnSidebarMenuItem,
  ShadcnSidebarMenuSub,
  ShadcnSidebarMenuSubButton,
  ShadcnSidebarMenuSubItem,
  ShadcnSidebarSeparator,
} from 'components';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import type { AppSidebarContentProps } from './types';
import { useAppSidebarContent } from './useAppSidebarContent';

const activeLinkClassName =
  'data-active:bg-primary/10 data-active:text-primary data-active:hover:bg-primary/15 data-active:hover:text-primary text-muted-foreground transition-colors';
const subLinkClassName = `${activeLinkClassName} h-auto min-h-7 py-1 whitespace-normal break-words`;
const menuButtonClassName = `${activeLinkClassName} in-data-[mobile=false]:h-auto in-data-[mobile=false]:min-h-18 in-data-[mobile=false]:flex-col in-data-[mobile=false]:justify-center in-data-[mobile=false]:gap-1 in-data-[mobile=false]:py-2 in-data-[mobile=false]:text-center in-data-[mobile=false]:text-xs`;
const menuLabelClassName =
  'font-semibold in-data-[mobile=false]:w-full in-data-[mobile=false]:whitespace-normal in-data-[mobile=false]:break-words';

const AppSidebarContent = ({ permissions }: AppSidebarContentProps) => {
  const { navItems, isMobile, openGroup, handleGroupOpenChange } =
    useAppSidebarContent(permissions);

  return (
    <ShadcnSidebarContent>
      <ShadcnSidebarGroup>
        <ShadcnSidebarMenu className='gap-2'>
          {navItems.map((item) => (
            <Fragment key={item.name}>
              {item.name === 'Settings' && (
                <ShadcnSidebarSeparator render={<li />} className='my-2' />
              )}
              {item.items ? (
                !isMobile ? (
                  <ShadcnSidebarMenuItem>
                    <DropdownMenu
                      modal={false}
                      open={openGroup === item.name}
                      onOpenChange={(open) => handleGroupOpenChange(item.name, open)}
                    >
                      <DropdownMenuTrigger
                        render={
                          <ShadcnSidebarMenuButton
                            size='lg'
                            isActive={item.isActive}
                            className={`${menuButtonClassName} group/dropdown`}
                          />
                        }
                      >
                        <span className='relative flex size-6 shrink-0 items-center justify-center'>
                          <item.Icon className='size-6!' />
                          <ChevronDown className='absolute left-full top-1/2 -translate-y-1/2 ml-1 size-3! transition-transform group-data-popup-open/dropdown:-rotate-90' />
                        </span>
                        <span className={menuLabelClassName}>{item.name}</span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side='right' sideOffset={12} className='w-fit'>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                          {item.items.map((link) => (
                            <DropdownMenuItem
                              key={link.href}
                              render={<Link href={link.href} />}
                              data-active={link.isActive || undefined}
                              className={subLinkClassName}
                            >
                              {link.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ShadcnSidebarMenuItem>
                ) : (
                  <Collapsible
                    render={<li />}
                    open={openGroup === item.name}
                    onOpenChange={(open) => handleGroupOpenChange(item.name, open)}
                    className='group/menu-item group/collapsible relative'
                  >
                    <CollapsibleTrigger
                      render={
                        <ShadcnSidebarMenuButton
                          size='lg'
                          isActive={item.isActive}
                          className={menuButtonClassName}
                        />
                      }
                    >
                      <item.Icon className='size-6!' />
                      <span className={menuLabelClassName}>{item.name}</span>
                      <ChevronRight className='ml-auto transition-transform group-data-open/collapsible:rotate-90' />
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <ShadcnSidebarMenuSub className='mx-4.5 px-2.75 gap-1'>
                        {item.items.map((link) => (
                          <ShadcnSidebarMenuSubItem key={link.href}>
                            <ShadcnSidebarMenuSubButton
                              render={<Link href={link.href} />}
                              isActive={link.isActive}
                              className={subLinkClassName}
                            >
                              {link.name}
                            </ShadcnSidebarMenuSubButton>
                          </ShadcnSidebarMenuSubItem>
                        ))}
                      </ShadcnSidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )
              ) : (
                <ShadcnSidebarMenuItem>
                  <ShadcnSidebarMenuButton
                    render={<Link href={item.href!} />}
                    size='lg'
                    isActive={item.isActive}
                    className={menuButtonClassName}
                  >
                    <item.Icon className='size-6!' />
                    <span className={menuLabelClassName}>{item.name}</span>
                  </ShadcnSidebarMenuButton>
                </ShadcnSidebarMenuItem>
              )}
            </Fragment>
          ))}
        </ShadcnSidebarMenu>
      </ShadcnSidebarGroup>
    </ShadcnSidebarContent>
  );
};

export default AppSidebarContent;
